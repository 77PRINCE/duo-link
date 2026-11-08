ANDROID_UA = (
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36"
)
IOS_UA = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
)
DESKTOP_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
)


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_create_link(client, link_payload):
    response = client.post("/api/v1/links", json=link_payload)
    assert response.status_code == 201
    body = response.json()
    assert body["app_name"] == "Example App"
    assert body["slug"] == "example-app"
    assert body["smart_url"] == "http://localhost:3000/r/example-app"
    assert body["id"] > 0


def test_create_link_rejects_invalid_url(client, link_payload):
    link_payload["android_url"] = "not-a-url"
    response = client.post("/api/v1/links", json=link_payload)
    assert response.status_code == 422


def test_create_link_rejects_ftp_url(client, link_payload):
    link_payload["ios_url"] = "ftp://example.com/app"
    response = client.post("/api/v1/links", json=link_payload)
    assert response.status_code == 422


def test_create_link_rejects_invalid_slug(client, link_payload):
    link_payload["slug"] = "Bad Slug!"
    response = client.post("/api/v1/links", json=link_payload)
    assert response.status_code == 422


def test_duplicate_slug_is_rejected(client, link_payload):
    first = client.post("/api/v1/links", json=link_payload)
    assert first.status_code == 201

    second = client.post("/api/v1/links", json=link_payload)
    assert second.status_code == 409
    assert second.json()["detail"] == "A link with this slug already exists."


def test_list_links(client, link_payload):
    client.post("/api/v1/links", json=link_payload)
    other = {**link_payload, "slug": "second-app", "app_name": "Second App"}
    client.post("/api/v1/links", json=other)

    response = client.get("/api/v1/links")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_single_link(client, link_payload):
    created = client.post("/api/v1/links", json=link_payload).json()
    response = client.get(f"/api/v1/links/{created['id']}")
    assert response.status_code == 200
    assert response.json()["slug"] == "example-app"


def test_get_missing_link_returns_404(client):
    response = client.get("/api/v1/links/9999")
    assert response.status_code == 404


def test_update_link(client, link_payload):
    created = client.post("/api/v1/links", json=link_payload).json()
    response = client.patch(
        f"/api/v1/links/{created['id']}",
        json={"app_name": "Renamed App", "slug": "renamed-app"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["app_name"] == "Renamed App"
    assert body["slug"] == "renamed-app"
    assert body["smart_url"] == "http://localhost:3000/r/renamed-app"


def test_update_to_duplicate_slug_is_rejected(client, link_payload):
    client.post("/api/v1/links", json=link_payload)
    second = client.post(
        "/api/v1/links",
        json={**link_payload, "slug": "second-app"},
    ).json()

    response = client.patch(
        f"/api/v1/links/{second['id']}", json={"slug": "example-app"}
    )
    assert response.status_code == 409


def test_delete_link(client, link_payload):
    created = client.post("/api/v1/links", json=link_payload).json()
    response = client.delete(f"/api/v1/links/{created['id']}")
    assert response.status_code == 204

    assert client.get(f"/api/v1/links/{created['id']}").status_code == 404


def test_resolve_android(client, link_payload):
    client.post("/api/v1/links", json=link_payload)
    response = client.get(
        "/api/v1/links/resolve/example-app", headers={"User-Agent": ANDROID_UA}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["platform"] == "android"
    assert body["target_url"] == link_payload["android_url"]


def test_resolve_ios(client, link_payload):
    client.post("/api/v1/links", json=link_payload)
    response = client.get(
        "/api/v1/links/resolve/example-app", headers={"User-Agent": IOS_UA}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["platform"] == "ios"
    assert body["target_url"] == link_payload["ios_url"]


def test_resolve_unsupported_platform(client, link_payload):
    client.post("/api/v1/links", json=link_payload)
    response = client.get(
        "/api/v1/links/resolve/example-app", headers={"User-Agent": DESKTOP_UA}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["platform"] == "other"
    assert body["target_url"] is None
    assert body["android_url"] == link_payload["android_url"]
    assert body["ios_url"] == link_payload["ios_url"]


def test_resolve_missing_slug_returns_404(client):
    response = client.get("/api/v1/links/resolve/does-not-exist")
    assert response.status_code == 404

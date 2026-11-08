from app.services.platform import detect_platform


def test_detects_android():
    ua = (
        "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36"
    )
    assert detect_platform(ua) == "android"


def test_detects_iphone():
    ua = (
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    )
    assert detect_platform(ua) == "ios"


def test_detects_ipad():
    ua = (
        "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 "
        "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    )
    assert detect_platform(ua) == "ios"


def test_detects_ipados_macintosh_mobile():
    ua = (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 "
        "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    )
    assert detect_platform(ua) == "ios"


def test_detects_desktop_as_other():
    ua = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
    )
    assert detect_platform(ua) == "other"


def test_missing_user_agent_is_other():
    assert detect_platform(None) == "other"
    assert detect_platform("") == "other"

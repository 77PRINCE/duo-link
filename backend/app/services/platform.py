from typing import Literal

Platform = Literal["android", "ios", "other"]


def detect_platform(user_agent: str | None) -> Platform:
    """Map a User-Agent string to a supported destination platform.

    This is intentionally isolated so the strategy can later be replaced with
    richer detection (client hints, headers, etc.) without touching routes or
    storage. Detection only identifies the operating system; it makes no claim
    about whether an app is installed.
    """

    if not user_agent:
        return "other"

    ua = user_agent.lower()

    if "android" in ua:
        return "android"

    if "iphone" in ua or "ipad" in ua or "ipod" in ua:
        return "ios"

    # Modern iPadOS reports itself as Macintosh but includes "Mobile".
    if "macintosh" in ua and "mobile" in ua:
        return "ios"

    return "other"

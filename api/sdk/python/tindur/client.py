import time
import requests
from typing import Any, Dict, Optional

class TindurError(Exception):
    """Base exception for Tindur SDK"""
    def __init__(self, message: str, status_code: Optional[int] = None, response_body: Optional[str] = None):
        super().__init__(message)
        self.status_code = status_code
        self.response_body = response_body

class TindurAuthError(TindurError):
    """Raised when authentication fails (401, 403)"""
    pass

class TindurRateLimitError(TindurError):
    """Raised when API rate limit is exceeded (429)"""
    pass

class TindurClientImpl:
    def __init__(self, api_key: str, base_url: str, timeout: int):
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "tindur-python-sdk/1.0.0"
        })

    def _request(self, method: str, endpoint: str, max_retries: int = 3, **kwargs) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        backoff = 1  # seconds

        for attempt in range(max_retries):
            try:
                response = self.session.request(
                    method=method,
                    url=url,
                    timeout=self.timeout,
                    **kwargs
                )
                
                if response.status_code == 429:
                    raise TindurRateLimitError("Rate limit exceeded", 429, response.text)
                
                if response.status_code in (401, 403):
                    raise TindurAuthError(f"Authentication failed: {response.text}", response.status_code, response.text)
                
                if not response.ok:
                    raise TindurError(f"API Error: {response.text}", response.status_code, response.text)

                return response.json() if response.content else {}

            except (requests.exceptions.ConnectionError, requests.exceptions.Timeout, TindurRateLimitError) as e:
                if attempt == max_retries - 1:
                    raise e
                
                time.sleep(backoff)
                backoff *= 2  # Exponential backoff
                continue
            except requests.exceptions.RequestException as e:
                raise TindurError(f"Network error: {str(e)}")

        raise TindurError("Max retries reached")
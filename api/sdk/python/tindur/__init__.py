from.client import TindurClient, TindurError, TindurAuthError, TindurRateLimitError

__all__ = [
    "TindurClient",
    "TindurError",
    "TindurAuthError",
    "TindurRateLimitError",
]

class TindurResource:
    """Base class for API resources."""
    def __init__(self, client):
        self._client = client

    def list(self, **params):
        return self._client._request("GET", f"/{self.__class__.__name__.lower()}s", params=params)

    def get(self, resource_id: str):
        return self._client._request("GET", f"/{self.__class__.__name__.lower()}s/{resource_id}")

class Organizations(TindurResource): pass
class Experiences(TindurResource): pass
class Schedules(TindurResource): pass
class Bookings(TindurResource): pass
class Payments(TindurResource): pass
class Payouts(TindurResource): pass
class ApiKeys(TindurResource): pass

class TindurClient:
    def __init__(self, api_key: str, base_url: str = 'https://api.tindur.is/v1', timeout: int = 30):
        from.client import TindurClientImpl
        self._impl = TindurClientImpl(api_key, base_url, timeout)
        
        # Expose resources
        self.organizations = Organizations(self)
        self.experiences = Experiences(self)
        self.schedules = Schedules(self)
        self.bookings = Bookings(self)
        self.payments = Payments(self)
        self.payouts = Payouts(self)
        self.api_keys = ApiKeys(self)

    def _request(self, method: str, endpoint: str, **kwargs):
        return self._impl._request(method, endpoint, **kwargs)
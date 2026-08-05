# Tindur Partner API
REST API dla touroperatorów do integracji z platformą Tindur.

## Quick start
1. Pobierz API key z dashboardu: [https://dashboard.tindur.is/settings/api-keys](https://dashboard.tindur.is/settings/api-keys)
2. Użyj SDK lub wywołaj endpoint bezpośrednio.

## Authentication
Wszystkie zapytania wymagają Bearer tokena w nagłówku:
`Authorization: Bearer tk_live_xxx`

## Rate limiting
- **Free:** 100 req/min
- **Pro:** 1000 req/min

## Endpoints
| Zasób | Metody | Endpoint |
| :--- | :--- | :--- |
| **Organizations** | `GET`, `PATCH` | `/v1/organizations/me` |
| **Experiences** | `GET`, `POST`, `PATCH`, `DELETE` | `/v1/experiences` |
| **Schedules** | `GET` | `/v1/schedules` |
| **Bookings** | `GET`, `POST (cancel)` | `/v1/bookings`, `/v1/bookings/{id}/cancel` |
| **Payments** | `GET` | `/v1/payments` |
| **Payouts** | `GET` | `/v1/payouts` |
| **API keys** | `GET`, `POST`, `DELETE` | `/v1/api-keys` |

## SDKs
- **TypeScript:** `npm install @tindur/sdk`
- **Python:** `pip install tindur-sdk`

## Errors
Standardowe kody odpowiedzi HTTP:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `429`: Too Many Requests
- `500`: Internal Server Error

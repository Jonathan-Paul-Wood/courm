## Toast Notifications

We use `react-toastify` for app-level notifications.

Notifications are rendered by `ToastWrapper`, which is mounted in `ui/src/common/App/App.js`.

## Project Policy

- `GET` / list / load flows should only toast on failure.
- `POST` / `PUT` / `DELETE` flows should toast on success and failure by default.
- Bulk actions must suppress per-item toasts and emit a single aggregate summary toast.
- Reducer error state should still be updated even when a toast is shown.

## Shared Helper

Use the shared helper in `ui/src/common/App/ToastWrapper/toastNotifications.js`.

```js
import {
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    normalizeToastMessage
} from '../../common/App/ToastWrapper/toastNotifications';
```

Prefer these helpers over calling `toast.success(...)` or `toast.error(...)` directly.

## Store Action Contract

Async thunk actions should:

- dispatch their existing pending / success / error actions,
- resolve with the service response on success,
- reject with `ServiceError` on failure,
- accept an optional final `notificationOptions` object:

```js
{
    successMessage?: string | false,
    errorMessage?: string,
    suppressSuccess?: boolean,
    suppressError?: boolean,
    toastId?: string
}
```

Use stable `toastId` values for repeated read failures so retries do not stack duplicate error toasts.

## UI Defaults

- Success toasts auto-close after a short delay.
- Error toasts remain visible until dismissed.
- `ToastWrapper` owns the shared visual styling for toast variants.

More library documentation is available here:
https://fkhadra.github.io/react-toastify/introduction

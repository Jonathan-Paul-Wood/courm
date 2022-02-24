## Toast Notifications

We use the `react-toastify` library for rendering notifications.

Notifications are rendered within the ToastWrapper component used in the App.js file.

A notification can be called from almost anywhere in the app using one of the
following functions:

```
    toast.success('Success');
    toast.error('Error');
    toast.warning('Warning');
    toast('Generic');
```

More documentation is available: https://fkhadra.github.io/react-toastify/introduction
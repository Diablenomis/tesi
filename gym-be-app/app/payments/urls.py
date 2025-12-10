from django.urls import path

from .views import CodScontoDetailView, CodScontoView, CustomerPortalView, PaySchedeTutorial, ProductDetView, ProductsView, SubscriptionView, CreateCheckoutSessionView, WebhookView

urlpatterns = [
    path('schede-tutorial/', PaySchedeTutorial.as_view(), name="pay-schedetutorial"),
    path('sconti/', CodScontoView.as_view(), name="create-discount"),
    path('sconti/<codice>/', CodScontoDetailView.as_view(), name="get-update-discount"),
    path('scheda-personalizzata/', SubscriptionView.as_view(), name="pay-schedapersonalizzata"),
    path('abbonamenti/', ProductsView.as_view(), name="create-products"),
    path('abbonamenti/<product_id>/', ProductDetView.as_view(), name="update-delete-products"),
    path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name="create-checkout-session"),
    path('create-customer-portal-session/', CustomerPortalView.as_view(), name="customer-portal-session"),
    path('webhook/', WebhookView.as_view(), name="webhook-session"),
]

import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './shared/common/auth.guard';

export const routes: Routes = [
    { 
        path: '', 
        component: PagesComponent, children: [
            { path: '', loadChildren: './pages/home/home.module#HomeModule' },
            { path: 'account', loadChildren: './pages/account/account.module#AccountModule',canActivate: [AuthGuard], data: { breadcrumb: 'Account' } },
            { path: 'compare', loadChildren: './pages/compare/compare.module#CompareModule', data: { breadcrumb: 'Compare' } },
            { path: 'wishlist', loadChildren: './pages/wishlist/wishlist.module#WishlistModule', data: { breadcrumb: 'Wishlist' } },
            { path: 'cart', loadChildren: './pages/cart/cart.module#CartModule', data: { breadcrumb: 'Cart' } },
            { path: 'checkout', loadChildren: './pages/checkout/checkout.module#CheckoutModule', data: { breadcrumb: 'Checkout' } },
            { path: 'contact', loadChildren: './pages/contact/contact.module#ContactModule', data: { breadcrumb: 'Contact' } },
            { path: 'sign-in', loadChildren: './pages/sign-in/sign-in.module#SignInModule', data: { breadcrumb: 'Sign In ' } },
            { path: 'brands', loadChildren: './pages/brands/brands.module#BrandsModule', data: { breadcrumb: 'Brands' } },
            { path: 'providers', loadChildren: './pages/products/products.module#ProductsModule' },
            { path: 'providers/:lat/:lng/:category/:distance', loadChildren: './pages/products/products.module#ProductsModule', data: { breadcrumb: 'All Providers' } },
            { path: 'become-seller', loadChildren: './pages/become-seller/become-seller.module#BecomeSellerModule', data: { breadcrumb: 'Become Provider' } },
            { path: 'how-it-works', loadChildren: './pages/how-it-works/how-it-works.module#HowItWorksModule', data: { breadcrumb: 'How It Works' } },
            { path: 'sign-up', loadChildren: './pages/sign-up/sign-up.module#SignUpModule', data: { breadcrumb: 'Sign Up' } },
            { path: 'feature', loadChildren: './pages/featured/featured.module#FeaturedModule', data: { breadcrumb: 'Feature Profile' } },
            { path: 'faq', loadChildren: './pages/faq/faq.module#FaqModule', data: { breadcrumb: 'FAQ' } },
            { path: 'security', loadChildren: './pages/security/security.module#SecurityModule', data: { breadcrumb: 'Security And Privacy' } },
            { path: 'terms', loadChildren: './pages/terms/terms.module#TermsModule', data: { breadcrumb: 'Terms And Conditions' } },
            { path: 'about-us', loadChildren: './pages/about/about.module#AboutModule', data: { breadcrumb: 'About Us' } },
            { path: 'policy', loadChildren: './pages/privacy-policy/privacy-policy.module#PrivacyPolicyModule', data: { breadcrumb: 'Privacy Policy' } },
        ]
    },
    { path: '**', component: NotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
   preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
   // useHash: true
});
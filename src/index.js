import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Keycloak from "keycloak-js";

const realm = process.env.REACT_APP_REALM;
const clientId = process.env.REACT_APP_CLIENTID;
const authServerUrl = process.env.REACT_APP_AUTH_SERVER_URL;

const kc = new Keycloak({
    realm,
    url: authServerUrl,
    "ssl-required": "none",
    clientId,
    "public-client": true,
    "bearer-only": false,
    "verify-token-audience": true,
    "use-resource-role-mappings": true,
    "confidential-port": 0
});

// Initialize keycloak and enable login-required on load
kc.init({
    onLoad: "login-required",
    promiseType: "native"
}).then(authenticated => {
    if (authenticated) {
        // Properties
        // Access token
        console.log("Access token: " + kc.token);

        // Access token parsed
        console.log("Access token parsed: " + kc.tokenParsed);

        // Refresh token
        console.log("Refresh token: " + kc.refreshToken);

        // ID token
        console.log("ID token: " + kc.idToken);

        // ID token parsed
        console.log("ID token parsed: " + kc.idTokenParsed);

        // Resource Access. Returns the object with clients and their roles
        console.log("Resource access: " + kc.resourceAccess);

        // Methods
        // Check resource access. Takes role name and client id as parameters
        console.log(
            "Has resource role? " + kc.hasResourceRole("Admin", "abc_dailyos")
        );

        // Logout method to clear user session, invalidate token and redirect to login
        // kc.logout();

        //store authentication tokens in sessionStorage for usage in app
        sessionStorage.setItem("accessToken", kc.tokenParsed);
        sessionStorage.setItem("refreshToken", kc.refreshToken);

        ReactDOM.render(<App />, document.getElementById("root"));
    } else {
        console.warn("not authenticated");
        // Redirect to login
        kc.login();
    }
});

// Callback events
// On token expired. When the token expires, we try to refresh it and get a new token.
// If the refresh token fails that means the session is expired. We redirect the user to login.
kc.onTokenExpired = () => {
    kc.updateToken(5).then(refreshed => {
        if (refreshed) {
            console.log("updated access token: " + kc.token);
        } else {
            console.log(
                "unable to refresh access token. Session Expired. Redirect to login."
            );
            kc.login();
        }
    });
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();

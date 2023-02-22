import Vue from "vue";
import VueApollo from "vue-apollo";
import {createApolloClient, restartWebsockets} from "vue-cli-plugin-apollo/graphql-client";
import {InMemoryCache} from "apollo-cache-inmemory";

Vue.use(VueApollo);

const AUTH_TOKEN = "apollo-token";
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP;
const defaultOptions = {
  httpEndpoint,
  wsEndpoint: process.env.VUE_APP_GRAPHQL_WS,
  tokenName: AUTH_TOKEN,
  persisting: false,
  websocketsOnly: false,
  ssr: false,
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  cache: new InMemoryCache(),
};

// eslint-disable-next-line require-jsdoc
export function createProvider() {
  const {apolloClient, wsClient} = createApolloClient({
    ...defaultOptions,
  });
  apolloClient.wsClient = wsClient;
  return new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        fetchPolicy: "network-only",
      },
    },
    errorHandler(error) {
      console.log("%cError", "background: red; color: white; padding: 2px 4px; " +
                "border-radius: 3px; font-weight: bold;", error.message);
    },
  });
}

// eslint-disable-next-line require-jsdoc
export async function onLogin(apolloClient, token) {
  if (typeof localStorage !== "undefined" && token) localStorage.setItem(AUTH_TOKEN, token);
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    console.log("%cError on cache reset (login)", "color: orange;", e.message);
  }
}

// eslint-disable-next-line require-jsdoc
export async function onLogout(apolloClient) {
  if (typeof localStorage !== "undefined") localStorage.removeItem(AUTH_TOKEN);
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    console.log("%cError on cache reset (logout)", "color: orange;", e.message);
  }
}

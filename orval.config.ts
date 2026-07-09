import { defineConfig } from 'orval';
import { publicApiUrl } from './src/lib/constants/app.config'; // '@/' alias is only resolved by TypeScript/bundler, not plain Node

export default defineConfig({
    KBUConnectApi: {
        input: {
            target: `${publicApiUrl}/api/docs/json`
        },
        output: {
            mode: 'tags-split', // one file per controller tag (auth, users, matches...)
            target: 'services/generated', // generated hooks go here
            schemas: 'services/model', // generated TS interfaces go here
            client: 'react-query',
            httpClient: 'axios',
            clean: true, // wipe generated folder on each run
            override: {
                mutator: {
                    path: 'src/lib/axios/axios-instance.ts',
                    name: 'axiosInstanceFn'
                },
                operations: {
                    DiscoveryController_getDiscovery: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor'
                        }
                    },
                    NotificationsController_getNotifications: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor'
                        }
                    },
                    ChatController_getShoutouts: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor'
                        }
                    },
                    ChatController_getConversations: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor'
                        }
                    },
                    ChatController_getConversationMessages: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor'
                        }
                    },
                    MatchesController_getMatches: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor'
                        }
                    },
                    BlockController_getBlockedUsers: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor'
                        }
                    }
                }
            }
        }
    }
});

import dotenv from 'dotenv';
import { defineConfig } from 'orval';

dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
if (!API_URL) {
    throw new Error('Missing env variable: NEXT_PUBLIC_API_URL');
}

export default defineConfig({
    KBUConnectApi: {
        input: {
            target: `${API_URL}/api/json`,
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
                    name: 'axiosInstanceFn',
                },
                operations: {
                    DiscoveryController_getDiscovery: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor',
                        },
                    },
                    NotificationsController_getNotifications: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor',
                        },
                    },
                    ChatController_getShoutouts: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor',
                        },
                    },
                    ChatController_getConversations: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor',
                        },
                    },
                    ChatController_getConversationMessages: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor',
                        },
                    },
                    MatchesController_getMatches: {
                        query: {
                            useInfinite: true,
                            useInfiniteQueryParam: 'cursor',
                        },
                    },
                },
            },
        },
    },
});

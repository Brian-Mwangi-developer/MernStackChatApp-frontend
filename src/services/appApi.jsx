import { createApi, fetchBaseQuery } from'@reduxjs/toolkit/query/react';
//define a service user a base URL

const appApi = createApi({
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000'
    }),
    endpoints: (builder) => ({
        //creating  new user
        signUpUser: builder.mutation({
            query: (user) => ({
                url: "/users",
                method: "POST",
                body: user,
            })
        }),
        //logging in a user
        loginUser: builder.mutation({
            query: (user) => ({
                url: "users/login",
                method: "POST",
                body: user,
            })
        }),
        //logging out a user
        logoutUser: builder.mutation({
            query: (payload) =>({
                url:"/logout",
                method: "DELETE",
            body: payload,
            }),

         }),
    }),
});

export const {useSignUpUserMutation,useLoginUserMutation,useLogoutUserMutation} =appApi;

export default appApi;
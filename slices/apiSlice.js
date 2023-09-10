import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://discussion-forum-fwz3.onrender.com/",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Post"],
  endpoints: (builder) => ({}),
});

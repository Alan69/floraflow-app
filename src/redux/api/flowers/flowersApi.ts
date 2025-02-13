import baseApi from "..";

export type TFlower = {
  uuid: string;
  text: string;
};

export type TFlowersResponse = {
  uuid: string;
  text: string;
};

export const flowersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFlowersList: build.query<TFlowersResponse[], { page?: number }>({
      query: ({ page } = {}) => ({
        url: "/flowers/",
        method: "GET",
        params: { page },
      }),
      transformResponse: (response: TFlowersResponse[]) => response,
    }),
  }),
  overrideExisting: false,
});

export const { useGetFlowersListQuery } = flowersApi;

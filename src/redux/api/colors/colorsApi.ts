import baseApi from "..";

export type TColor = {
  uuid: string;
  text: string;
};

export type TColorsResponse = {
  uuid: string;
  text: string;
};

export const colorsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getColorsList: build.query<TColorsResponse[], { page?: number }>({
      query: ({ page } = {}) => ({
        url: "/colors/",
        method: "GET",
        params: { page },
      }),
      transformResponse: (response: TColorsResponse[]) => response,
    }),
  }),
  overrideExisting: false,
});

export const { useGetColorsListQuery } = colorsApi;

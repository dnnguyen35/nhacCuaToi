import publicClient from "../client/public.client";

const searchEnpoints = {
  searchAll: "searchs/search-all",
};

const searchApi = {
  searchAllTypes: async ({ keyword, type }) => {
    try {
      const response = await publicClient.get(searchEnpoints.searchAll, {
        params: { keyword, type },
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default searchApi;

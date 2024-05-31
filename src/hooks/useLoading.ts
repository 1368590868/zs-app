export function useLoading() {
  const loading = (state: boolean = false) => {
    if (state) {
      uni.showLoading({
        title: "加载中",
      });
    } else {
      uni.hideLoading();
    }
  };
  return {
    loading,
  };
}

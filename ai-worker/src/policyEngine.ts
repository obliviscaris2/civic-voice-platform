export function applyPolicy(data: any) {

  if (data.safety.containsPrivateInfo) {
    return {
      status: "restricted",
      reason: "contains private info"
    };
  }

  return {
    status: "publish"
  };

}

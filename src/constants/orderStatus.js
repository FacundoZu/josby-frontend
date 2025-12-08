export const ORDER_STATUS_CONFIG = {
  all: { label: "Todos" },
  pending: {
    label: "Pendiente",
    badgeClasses:
      "bg-[#ffc10733] text-[#1A202C] border border-[#ffc10780]",
  },
  in_process: {
    label: "En proceso",
    badgeClasses:
      "bg-[#38ced633] text-[#1A202C] border border-[#38ced680]",
  },
  review: {
    label: "En revisión",
    badgeClasses:
      "bg-[#5834b733] text-[#1A202C] border border-[#5834b780]",
  },
  delivered: {
    label: "Finalizado",
    badgeClasses:
      "bg-[#28a74533] text-[#1A202C] border border-[#28a74580]",
  },
};

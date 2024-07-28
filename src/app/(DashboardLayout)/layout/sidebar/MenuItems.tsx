import {
  IconAsset,
  IconList,
  IconLayoutDashboard,
  IconMoodHappy,
  IconCalendarStats,
  IconCategory,
  IconLocation,
  IconBellSchool,
  IconSearch,
  IconTablePlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Aset",
  },
  {
    id: uniqueId(),
    title: "Aset",
    icon: IconAsset,
    href: "/asset",
  },
  {
    id: uniqueId(),
    title: "Log Perbaikan Aset",
    icon: IconList,
    href: "/asset-log",
  },
  {
    id: uniqueId(),
    title: "Cari Aset",
    icon: IconSearch,
    href: "/find-asset",
  },
  {
    id: uniqueId(),
    title: "Bulk Perbaikan Aset",
    icon: IconTablePlus,
    href: "/asset-log-bulk",
  },
  // {
  //   navlabel: true,
  //   subheader: "Utilities",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Typography",
  //   icon: IconTypography,
  //   href: "/utilities/typography",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Shadow",
  //   icon: IconCopy,
  //   href: "/utilities/shadow",
  // },
  {
    navlabel: true,
    subheader: "Master Data",
  },
  {
    id: uniqueId(),
    title: "Tahun",
    icon: IconCalendarStats,
    href: "/year-quarter",
  },
  {
    id: uniqueId(),
    title: "Kategori Asset",
    icon: IconCategory,
    href: "/category",
  },
  {
    id: uniqueId(),
    title: "Lokasi",
    icon: IconLocation,
    href: "/location",
  },
  {
    id: uniqueId(),
    title: "Program Studi",
    icon: IconBellSchool,
    href: "/study-program",
  },
  {
    navlabel: true,
    subheader: "Account",
  },
  {
    id: uniqueId(),
    title: "Users",
    icon: IconMoodHappy,
    href: "/users",
  },
  // {
  //   id: uniqueId(),
  //   title: "Sample Page",
  //   icon: IconAperture,
  //   href: "/sample-page",
  // },
];

export default Menuitems;

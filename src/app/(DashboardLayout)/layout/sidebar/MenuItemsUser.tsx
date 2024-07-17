import {
  IconAsset,
  IconList,
  IconLayoutDashboard,
  IconMoodHappy,
  IconCalendarStats,
  IconCategory,
  IconLocation,
  IconBellSchool,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const MenuItemsUser = [
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
];

export default MenuItemsUser;

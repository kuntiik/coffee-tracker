import type { Roastery } from "../types"

// Default roasteries data
export const defaultRoasteries: Roastery[] = [
  {
    id: 1,
    name: "Coffeespot",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=400&width=1200",
    location: "Prague, Czech Republic",
    founded: 2012,
    description:
      "Coffeespot is a specialty coffee roaster based in Prague, focusing on direct trade relationships with farmers. They are known for their meticulous approach to roasting and commitment to sustainability.",
    website: "https://www.coffeespot.cz",
    coffeeIds: [1, 7, 8],
    featured: true,
  },
  {
    id: 2,
    name: "Doubleshot",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=400&width=1200",
    location: "Prague, Czech Republic",
    founded: 2010,
    description:
      "Doubleshot is one of the pioneers of specialty coffee in the Czech Republic. They focus on sourcing exceptional coffees directly from farmers and roasting them to highlight their unique characteristics.",
    website: "https://www.doubleshot.cz",
    coffeeIds: [2, 9],
    featured: true,
  },
  {
    id: 3,
    name: "Beansmith",
    logo: "/placeholder.svg?height=100&width=100",
    location: "Brno, Czech Republic",
    founded: 2015,
    description:
      "Beansmith is a craft coffee roaster from Brno, focusing on small-batch roasting and seasonal offerings. They work closely with farmers to ensure quality and fair prices.",
    coffeeIds: [3],
    featured: false,
  },
  {
    id: 4,
    name: "Candycane Coffee",
    logo: "/placeholder.svg?height=100&width=100",
    location: "Ostrava, Czech Republic",
    founded: 2017,
    description:
      "Candycane Coffee is a specialty coffee roaster known for their experimental processing methods and unique flavor profiles. They focus on creating memorable coffee experiences.",
    coffeeIds: [4],
    featured: true,
  },
  {
    id: 5,
    name: "Rebelbean",
    logo: "/placeholder.svg?height=100&width=100",
    location: "Brno, Czech Republic",
    founded: 2013,
    description:
      "Rebelbean is a specialty coffee roaster with a focus on transparency and sustainability. They source their beans directly from farmers and are committed to ethical practices.",
    coffeeIds: [5],
    featured: false,
  },
  {
    id: 6,
    name: "Nordbeans",
    logo: "/placeholder.svg?height=100&width=100",
    location: "Liberec, Czech Republic",
    founded: 2016,
    description:
      "Nordbeans is a specialty coffee roaster from northern Czech Republic, focusing on Nordic-style light roasts that highlight the natural flavors of the coffee beans.",
    coffeeIds: [6],
    featured: false,
  },
]

// Czech roasteries data
export const czechRoasteries: Roastery[] = [
  {
    id: 1,
    name: "The naughty dog",
    logo: "https://st.kofio.co/img_u/iqXzFhp0ZJ7KInQ/jeC3DuhvM5OVmYxrfcUn_612_thumb.jpg",
    location: "Jílové u Prahy, Czech Republic",
    description:
      "A small roaster focusing on African coffees (mainly Ethiopia) and coffees from Central and South America. Gwilym Davies, the 2009 World Champion, and his assistant Ondřej Veselý are in charge of roasting. Petra Veselá, author of the Big Book of Coffee, handles orders, packaging, and quality control.",
    website: "http://naughtydog.cz/",
    coverImage: "/placeholder.svg?height=400&width=1200",
    coffeeIds: [1, 7],
    featured: true,
    imageUrl: "https://st.kofio.co/img_u/iqXzFhp0ZJ7KInQ/jeC3DuhvM5OVmYxrfcUn_612_thumb.jpg",
    kofio_url: "https://www.kofio.co/naughty-dog",
    city: "Jílové u Prahy",
    about:
      "A small roaster focusing on African coffees (mainly Ethiopia) and coffees from Central and South America. Gwilym Davies, the 2009 World Champion, and his assistant Ondřej Veselý are in charge of roasting. Petra Veselá, author of the Big Book of Coffee, handles orders, packaging, and quality control.",
    country: "Czech Republic",
    website_url: "http://naughtydog.cz/",
  },
  {
    id: 2,
    name: "Candycane Coffee",
    logo: "https://st.kofio.co/img_u/rbmagc3JTMFGsyR/Lq3fy7iCAPdpkFVmOtzY_368_thumb.png",
    location: "Praha 10, Czech Republic",
    description:
      "We are Candycane coffee, boys who roast coffee as sweet as candy and offer additional services for cafes, restaurants and hotels, as well as coffee programs for offices and educational courses for baristas and coffee enthusiasts.",
    website: "https://www.candycane.coffee/",
    coverImage: "/placeholder.svg?height=400&width=1200",
    coffeeIds: [2, 8],
    featured: true,
    imageUrl: "https://st.kofio.co/img_u/rbmagc3JTMFGsyR/Lq3fy7iCAPdpkFVmOtzY_368_thumb.png",
    kofio_url: "https://www.kofio.co/candycane-coffee",
    city: "Praha 10",
    about:
      "We are Candycane coffee, boys who roast coffee as sweet as candy and offer additional services for cafes, restaurants and hotels, as well as coffee programs for offices and educational courses for baristas and coffee enthusiasts.",
    country: "Czech Republic",
    website_url: "https://www.candycane.coffee/",
  },
  {
    id: 3,
    name: "Beansmith",
    logo: "https://st.kofio.co/img_u/BaQIeAwD4ohV1Nx/TrNmAXMHv8sYjIQ4ex3q_11_thumb.jpg",
    location: "Úhonice, Czech Republic",
    description:
      "We are local speciality coffee roasters. Our goal is to produce a high-quality final product, roasted from fresh ingredients.",
    website: "https://beansmiths.com",
    coverImage: "/placeholder.svg?height=400&width=1200",
    coffeeIds: [3],
    featured: false,
    imageUrl: "https://st.kofio.co/img_u/BaQIeAwD4ohV1Nx/TrNmAXMHv8sYjIQ4ex3q_11_thumb.jpg",
    kofio_url: "https://www.kofio.co/beansmiths",
    city: "Úhonice",
    about:
      "We are local speciality coffee roasters. Our goal is to produce a high-quality final product, roasted from fresh ingredients.",
    country: "Czech Republic",
    website_url: "https://beansmiths.com",
  },
  {
    id: 4,
    name: "Doubleshot",
    logo: "https://st.kofio.co/img_u/FRyreLDGEf619SU/F896Vz132mW0GOo4PTyI_111126_thumb.png",
    location: "Prague, Czech Republic",
    description:
      "Doubleshot is one of the pioneers of specialty coffee in the Czech Republic. They focus on sourcing exceptional coffees directly from farmers and roasting them to highlight their unique characteristics.",
    website: "https://www.doubleshot.cz",
    coverImage: "/placeholder.svg?height=400&width=1200",
    coffeeIds: [4],
    featured: true,
    imageUrl: "https://st.kofio.co/img_u/FRyreLDGEf619SU/F896Vz132mW0GOo4PTyI_111126_thumb.png",
    kofio_url: "https://www.kofio.co/doubleshot",
    city: "Prague",
    about:
      "Doubleshot is one of the pioneers of specialty coffee in the Czech Republic. They focus on sourcing exceptional coffees directly from farmers and roasting them to highlight their unique characteristics.",
    country: "Czech Republic",
    website_url: "https://www.doubleshot.cz",
  },
  {
    id: 5,
    name: "Father's Coffee Roastery",
    logo: "https://st.kofio.co/img_u/73XcFvutxIVr2GC/ovfaCr3hpwUGPkHY7BQ5_441_thumb.png",
    location: "Ostrava, Czech Republic",
    description:
      "The Father's Coffee Roastery was founded in 2018 in Ostrava, Czech republic. The roastery focuses on every detail of its roasting and quality is its number one priority.",
    website: "https://www.fatherscoffeeroastery.com/",
    coverImage: "/placeholder.svg?height=400&width=1200",
    coffeeIds: [5],
    featured: false,
    imageUrl: "https://st.kofio.co/img_u/73XcFvutxIVr2GC/ovfaCr3hpwUGPkHY7BQ5_441_thumb.png",
    kofio_url: "https://www.kofio.co/fathers-coffee",
    city: "Ostrava",
    about:
      "The Father's Coffee Roastery was founded in 2018 in Ostrava, Czech republic. The roastery focuses on every detail of its roasting and quality is its number one priority.",
    country: "Czech Republic",
    website_url: "https://www.fatherscoffeeroastery.com/",
  },
  {
    id: 6,
    name: "Nordbeans",
    logo: "https://st.kofio.co/img_u/6oTz9ULGdmM0DrF/3YWfmqOwsokNj9hKVtDX_3_thumb.jpg",
    location: "Liberec, Czech Republic",
    description:
      "Speciality Coffee Roasters from the North of Czech Republic. We know that coffee isn't just about your daily caffeine intake.",
    website: "http://www.nordbeans.cz",
    coverImage: "/placeholder.svg?height=400&width=1200",
    coffeeIds: [6],
    featured: false,
    imageUrl: "https://st.kofio.co/img_u/6oTz9ULGdmM0DrF/3YWfmqOwsokNj9hKVtDX_3_thumb.jpg",
    kofio_url: "https://www.kofio.co/nordbeans",
    city: "Liberec",
    about:
      "Speciality Coffee Roasters from the North of Czech Republic. We know that coffee isn't just about your daily caffeine intake.",
    country: "Czech Republic",
    website_url: "http://www.nordbeans.cz",
  },
]


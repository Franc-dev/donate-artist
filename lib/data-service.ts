import type { Artist, Battle } from "@/types"

// This would typically be an API call to your backend
export class DataService {
  static async loadArtists(): Promise<Artist[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Return sample artists data
    return [
      {
        id: "1",
        name: "Bien Aime Baraza",
        bio: "Lead vocalist of Sauti Sol and solo artist known for his soulful voice and Afro-pop hits.",
        avatar: "https://res.cloudinary.com/dunssu2gi/image/upload/v1753883331/blog-images/tlz5n4tsyikvtv5suisx.jpg",
        genre: "Afro-pop",
        youtubeUrl: "https://www.youtube.com/embed/uCTzC3y4kbU",
        votes: 0,
        totalDonations: 0,
        donorCount: 0,
        socialLinks: {
          instagram: "bienaimeb",
          twitter: "bienaimeb",
          spotify: "bien-aime-baraza",
          youtube: "@BienAimeBaraza",
        },
      },
      {
        id: "2",
        name: "Diamond Platnumz",
        bio: "Tanzanian bongo flava recording artist, dancer, philanthropist and businessman.",
        avatar: "https://res.cloudinary.com/dunssu2gi/image/upload/v1753883330/blog-images/rtkoxdihne1bor2lhkw1.jpg",
        genre: "Bongo Flava",
        youtubeUrl: "https://www.youtube.com/embed/IokCG2J-_5Q",
        votes: 0,
        totalDonations: 0,
        donorCount: 0,
        socialLinks: {
          instagram: "diamondplatnumz",
          twitter: "diamondplatnumz",
          spotify: "diamond-platnumz",
          youtube: "@DiamondPlatnumzOfficial",
        },
      },
    ]
  }

  static async loadCurrentBattle(): Promise<Battle | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return sample battle data
    return {
      id: "battle-1",
      artist1Id: "1",
      artist2Id: "2",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      isActive: true,
    }
  }

  // Helper method to create sample data for testing
  static createSampleData() {
    const artists: Artist[] = [
      {
        id: "1",
        name: "Bien Aime Baraza",
        bio: "Lead vocalist of Sauti Sol and solo artist known for his soulful voice and Afro-pop hits.",
        avatar: "https://res.cloudinary.com/dunssu2gi/image/upload/v1753883331/blog-images/tlz5n4tsyikvtv5suisx.jpg",
        genre: "Afro-pop",
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        votes: 1247,
        totalDonations: 45600,
        donorCount: 89,
        socialLinks: {
          instagram: "bienaimeb",
          twitter: "bienaimeb",
          spotify: "bien-aime-baraza",
          youtube: "@BienAimeBaraza",
        },
      },
      {
        id: "2",
        name: "Diamond Platnumz",
        bio: "Tanzanian bongo flava recording artist, dancer, philanthropist and businessman.",
        avatar: "https://res.cloudinary.com/dunssu2gi/image/upload/v1753883330/blog-images/rtkoxdihne1bor2lhkw1.jpg",
        genre: "Bongo Flava",
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        votes: 1156,
        totalDonations: 52300,
        donorCount: 112,
        socialLinks: {
          instagram: "diamondplatnumz",
          twitter: "diamondplatnumz",
          spotify: "diamond-platnumz",
          youtube: "@DiamondPlatnumzOfficial",
        },
      },
    ]

    const currentBattle: Battle = {
      id: "battle-1",
      artist1Id: "1",
      artist2Id: "2",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      isActive: true,
    }

    return { artists, currentBattle }
  }
} 
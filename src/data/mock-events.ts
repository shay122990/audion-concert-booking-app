const mockEvents = [
  // EDM
  {
    title: "EDM Bash 2025",
    dates: ["2025-10-15"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    description: "A high-energy electronic dance music bash featuring world-renowned DJs.",
    lineup: ["David Guetta", "Martin Garrix", "Dimitri Vegas & Like Mike"],
    location: "Palm Jumeirah",
    image: "https://dancingastronaut.com/wp-content/uploads/2022/01/Five-hotel_411_21.02.2020.jpg",
    category: "EDM",
  },
  {
    title: "Neon Pulse Festival",
    dates: ["2025-08-25"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    description: "A vibrant EDM festival with glowing visuals and non-stop music.",
    lineup: ["Steve Aoki", "Alesso", "Tiësto"],
    location: "Dubai Arena",
    image: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=800&auto=format&fit=crop&q=60",
    category: "EDM",
  },
  {
    title: "Trance City Nights",
    dates: ["2025-09-18"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    description: "Dive deep into a trance state with top trance music artists.",
    lineup: ["Armin van Buuren", "Above & Beyond", "Ferry Corsten"],
    location: "Al Quoz Warehouse",
    image: "https://images.unsplash.com/photo-1574847052651-02b57f7f5a4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2FyZWhvdXNlJTIwcGFydHl8ZW58MHx8MHx8fDA%3D",
    category: "EDM",
  },
  {
    title: "Electric Groove",
    dates: ["2025-11-22"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    description: "Electric beats and groovy vibes await at Global Village.",
    lineup: ["Kygo", "Zedd", "Don Diablo"],
    location: "Global Village",
    image: "https://images.unsplash.com/photo-1670235528409-7029ebfd59ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2xvYmFsJTIwdmlsbGFnZXxlbnwwfHwwfHx8MA%3D%3D",
    category: "EDM",
  },
  {
    title: "Bass Nation",
    dates: ["2025-12-10"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    description: "The heaviest bass lines and heart-thumping drops all night long.",
    lineup: ["Excision", "Skrillex", "REZZ"],
    location: "Jumeirah Beach",
    image: "https://images.unsplash.com/photo-1609940539397-3fa778baf74a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmFzcyUyMGNvbmNlcnR8ZW58MHx8MHx8fDA%3D",
    category: "EDM",
  },
  {
    title: "Midnight Drops",
    dates: ["2026-01-14"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    description: "Underground EDM beats under the stars in the desert.",
    lineup: ["Illenium", "KSHMR", "Seven Lions"],
    location: "Desert Club",
    image: "https://images.unsplash.com/photo-1603350902363-3141f62b7dba?w=800&auto=format&fit=crop&q=60",
    category: "EDM",
  },
  // Indie
  {
    title: "Indie Night Live",
    dates: ["2025-09-02"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    description: "Experience the raw and heartfelt sounds of Dubai's Indie scene.",
    lineup: ["The Local Strums", "Echo Parade", "Sunset Vinyl"],
    location: "The Arena, Dubai",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&auto=format&fit=crop&q=60",
    category: "Indie",
  },
  {
    title: "Cozy Indie Evenings",
    dates: ["2025-10-12"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    description: "An intimate night of indie vibes under the stars.",
    lineup: ["The Couch Sessions", "Acoustic Soul", "Maple Sky"],
    location: "Downtown Rooftop",
    image: "https://images.unsplash.com/photo-1525186402429-b4ff38bedec6?w=800&auto=format&fit=crop&q=60",
    category: "Indie",
  },
  {
    title: "Indie Desert Chill",
    dates: ["2025-11-05"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    description: "Chill out in the serene desert with indie acoustic tunes.",
    lineup: ["The Nomads", "Soft Bloom", "Sahara Strings"],
    location: "Al Marmoom",
    image: "https://images.unsplash.com/photo-1548944350-06c7375dfffb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW5kaWUlMjBjb25jZXJ0JTIwaW4lMjB0aGUlMjBkZXNlcnR8ZW58MHx8MHx8fDA%3D",
    category: "Indie",
  },
  {
    title: "Vinyl Vibes",
    dates: ["2025-12-15"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    description: "Spin back in time with classic indie records and performances.",
    lineup: ["Indie Vault", "Retro Riffs", "Needle Drop"],
    location: "Barsha Hub",
    image: "https://images.unsplash.com/photo-1621619054919-167f2fcf135c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c291bCUyMGphbXxlbnwwfHwwfHx8MA%3D%3D",
    category: "Indie",
  },
  {
    title: "Alternative Echo",
    dates: ["2026-01-05"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    description: "An alternative wave of echoing rhythms and fresh sounds.",
    lineup: ["Shadow Lines", "Eastbound", "Signal Static"],
    location: "Bluewaters",
    image: "https://images.unsplash.com/photo-1597849457406-442b94770a95?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGluZGllJTIwY29uY2VydHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Indie",
  },
  {
    title: "Indie Soul Jam",
    dates: ["2026-02-09"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    description: "A soulful fusion of indie rock and acoustic storytelling.",
    lineup: ["Soul Tide", "Folk Forest", "Velvet Town"],
    location: "La Mer Stage",
    image: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=800&auto=format&fit=crop&q=60",
    category: "Indie",
  },
  // Pop
  {
    title: "Pop Explosion",
    dates: ["2025-08-12"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Coca-Cola Arena",
    image: "https://images.unsplash.com/photo-1653581364580-5a1074a1fa31?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29jYSUyMGNvbGElMjBhcmVuYXxlbnwwfHwwfHx8MA%3D%3D",
    category: "Pop",
    description: "A high-energy pop concert featuring the biggest chart-toppers and electrifying performances. Get ready to dance the night away!",
    lineup: ["Ava Monroe", "The City Lights", "Luna Ray"]
  },
  {
    title: "Neon Pop Tour",
    dates: ["2025-09-15"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Mall of the Emirates Stage",
    image: "https://images.unsplash.com/photo-1525286116112-b59af11adad1?w=800&auto=format&fit=crop&q=60",
    category: "Pop",
    description: "A dazzling neon-themed tour bringing vibrant visuals and unforgettable pop anthems to life in the heart of the city.",
    lineup: ["Nova Bloom", "Electric Hearts", "DJ Kalei"]
  },
  {
    title: "Summer Pop Hits",
    dates: ["2025-10-01"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "City Walk",
    image: "https://images.unsplash.com/photo-1718634353354-fa2fc07e3080?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcCUyMGNvbmNlcnQlMjBvdXRkb29yc3xlbnwwfHwwfHx8MA%3D%3D",
    category: "Pop",
    description: "Celebrate the end of summer with chart-topping pop hits and a vibrant crowd under the stars.",
    lineup: ["Skyler June", "The Poptones", "Melody Lane"]
  },
  {
    title: "Retro Pop Night",
    dates: ["2025-11-20"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Festival City",
    image: "https://images.unsplash.com/photo-1600146698733-a339319d56e1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBvcCUyMGNvbmNlcnR8ZW58MHx8MHx8fDA%3D",
    category: "Pop",
    description: "Take a trip down memory lane with a nostalgic night of retro pop favorites and 80s vibes.",
    lineup: ["Flashback", "Glitter Echo", "Cassette Crush"]
  },
  {
    title: "Future Pop Stars",
    dates: ["2025-12-08"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Dubai Parks",
    image: "https://images.unsplash.com/photo-1731521581630-46864db40e18?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZ1dHVyZSUyMHBvcCUyMHN0YXJ8ZW58MHx8MHx8fDA%3D",
    category: "Pop",
    description: "Discover tomorrow's pop legends at this showcase of rising stars, packed with energy and fresh talent.",
    lineup: ["Echo Nova", "Sierra Sparks", "The Future Beat"]
  },
  {
    title: "Desert Pop Fever",
    dates: ["2026-01-11"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Desert Sound Dome",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60",
    category: "Pop",
    description: "An open-air desert concert like no other—feel the heat with pop bangers and a wild crowd under the stars.",
    lineup: ["Phoenix Pulse", "Starlit Crew", "Amber Waves"]
  },
  // Rock
  {
    title: "Rock the Desert",
    dates: ["2025-12-20"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Al Qudra Desert Camp",
    image: "https://images.unsplash.com/photo-1527419105721-af1f23c86dec?w=800&auto=format&fit=crop&q=60",
    category: "Rock",
    description: "Feel the raw energy of rock echo across the dunes with a night of gritty performances and roaring guitars in the heart of the desert.",
    lineup: ["The Sandstorm", "Desert Roar", "Black Ember"]
  },
  {
    title: "Rock Revolution",
    dates: ["2026-01-22"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Motor City Arena",
    image: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=800&auto=format&fit=crop&q=60",
    category: "Rock",
    description: "Unleash your inner rebel at this full-throttle rock fest showcasing the boldest new acts and iconic rockers.",
    lineup: ["Static Echo", "Riot Theory", "Ashfall"]
  },
  {
    title: "Guitar Gods",
    dates: ["2026-02-10"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Hard Rock Cafe",
    image: "https://images.unsplash.com/photo-1566320239266-7a352f8c382a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGd1aXRhciUyMGdvZHN8ZW58MHx8MHx8fDA%3D",
    category: "Rock",
    description: "A night for the legends—witness guitar virtuosos light up the stage with jaw-dropping solos and heavy riffs.",
    lineup: ["Axel Storm", "The Licks", "Neon Revolver"]
  },
  {
    title: "Metal Mayhem",
    dates: ["2026-03-05"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Dubai Media City",
    image: "https://images.unsplash.com/photo-1506091403742-e3aa39518db5?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Rock",
    description: "Brace yourself for a night of headbanging, shredding, and pure metal madness at this epic gathering of heavy-hitters.",
    lineup: ["Iron Clad", "Crimson Surge", "Skulltone"]
  },
  {
    title: "Alt Rock United",
    dates: ["2026-03-30"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Live Nation Stage",
    image: "https://images.unsplash.com/photo-1600528777391-4e35bf973e44?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFsdGVybmF0aXZlJTIwcm9ja3xlbnwwfHwwfHx8MA%3D%3D",
    category: "Rock",
    description: "Alternative vibes collide with indie edge in this genre-bending rock showcase packed with unique sounds and heartfelt lyrics.",
    lineup: ["Echo Drift", "Velvet Sun", "The North Ends"]
  },
  {
    title: "Legends of Rock",
    dates: ["2026-04-18"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "City Amphitheatre",
    image: "https://images.unsplash.com/photo-1651336450907-bf65259b87be?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGVnZW5kcyUyMG9mJTIwcm9ja3xlbnwwfHwwfHx8MA%3D%3D",
    category: "Rock",
    description: "A tribute to the legends who defined rock 'n' roll—relive the classics and rock anthems that shaped generations.",
    lineup: ["The Thunder Lords", "Crimson Strings", "Viper Road"]
  },
  //JAZZ
  {
    title: "Jazz Under the Stars",
    dates: ["2025-11-05"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Dubai Opera Garden",
    image: "https://images.unsplash.com/photo-1559752067-f30e5f277930?w=800&auto=format&fit=crop&q=60",
    category: "Jazz",
    description: "Enjoy a magical night of smooth melodies and soulful rhythms under the open sky at Dubai’s most elegant garden venue.",
    lineup: ["Leila Sade Trio", "Midnight Groove", "Emirates Jazz Ensemble"]
  },
  {
    title: "Blue Note Dubai",
    dates: ["2025-12-02"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "JBR Amphitheatre",
    image: "https://images.unsplash.com/photo-1715015326993-c020872670b7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amF6eiUyMG91dGRvb3JzfGVufDB8fDB8fHww",
    category: "Jazz",
    description: "An intimate evening of world-class jazz, featuring classic standards and contemporary interpretations in a beautiful beachfront setting.",
    lineup: ["Blue Note Quartet", "Hassan Keys", "The Jazztet"]
  },
  {
    title: "Sax in the City",
    dates: ["2026-01-19"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Burj Park",
    image: "https://images.unsplash.com/photo-1742500294033-0853fdf1ac06?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGphenolMjBvdXRkb29yc3xlbnwwfHwwfHx8MA%3D%3D",
    category: "Jazz",
    description: "Let the smooth sounds of saxophones set the mood in this cityscape jazz celebration featuring soulful solos and rich harmonies.",
    lineup: ["Sax Appeal", "Noura Jazz", "Ali & The Notes"]
  },
  {
    title: ["Smooth Vibes Festival"],
    dates: "2026-02-14",
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "The Green Room",
    image: "https://images.unsplash.com/photo-1738322817781-1a95ad2c4f54?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGphenolMjBmZXN0aXZhbHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Jazz",
    description: "Celebrate love and music with soothing jazz, lounge vibes, and candlelit ambiance on a special Valentine’s evening.",
    lineup: ["Velvet Vibe Collective", "Jazz & Roses", "Mona Elise"]
  },
  {
    title: ["Jazz & Chill Sessions"],
    dates: "2026-03-03",
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",    
    location: "Boxpark",
    image: "https://images.unsplash.com/photo-1730406919258-b031632e3de8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGphenolMjBmZXN0aXZhbHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Jazz",
    description: "A laid-back evening for jazz lovers looking to unwind with mellow grooves and local talent in a chill urban spot.",
    lineup: ["Chill Keys", "Bass & Brushes", "Jasmine Flow"]
  },
  {
    title: "Desert Jazz Collective",
    dates: ["2026-04-05"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Desert Pavilion",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=60",
    category: "Jazz",
    description: "An immersive jazz experience blending nature and music, where smooth sounds echo across the tranquil desert night.",
    lineup: ["Nomad Jazz Co.", "The Sandtones", "Zayna Sax"]
  },
  //CLASSICAL
  {
    title: "Beethoven by the Bay",
    dates: ["2025-09-10"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Dubai Opera",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2xhc3NpY2FsJTIwbXVzaWN8ZW58MHx8MHx8fDA%3D",
    category: "Classical",
    description: "Experience the brilliance of Beethoven’s symphonies in a breathtaking performance by the bay’s finest orchestra.",
    lineup: ["Dubai Symphony Orchestra", "Maestro Albrecht", "The Chamber Virtuosi"]
  },
  {
    title: "Mozart Magic",
    dates: ["2025-10-01"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Burj Park Stage",
    image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNsYXNzaWNhbCUyMG11c2ljfGVufDB8fDB8fHww",
    category: "Classical",
    description: "A whimsical evening of Mozart's greatest works performed in the open air against the city skyline.",
    lineup: ["Amira Ensemble", "Viola Nova", "City Strings Quartet"]
  },
  {
    title: "Strings in the Sky",
    dates: ["2025-11-17"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Sky Views Observatory",
    image: "https://images.unsplash.com/photo-1507739599340-3f6f8f347bfe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2JzZXJ2YXRvcnklMjBjb25jZXJ0fGVufDB8fDB8fHww",
    category: "Classical",
    description: "Let classical strings soar above the city as you enjoy a concert in the clouds at Sky Views Observatory.",
    lineup: ["The Sky Quartet", "Harper Duo", "Elyssa Tan"]
  },
  {
    title: "Opera in the Garden",
    dates: ["2025-12-09"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Safa Park",
    image: "https://images.unsplash.com/photo-1602080338149-55253d24c68a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b3BlcmElMjBnYXJkZW58ZW58MHx8MHx8fDA%3D",
    category: "Classical",
    description: "An enchanting evening of opera arias and classical duets performed in the lush beauty of Safa Park.",
    lineup: ["Dubai Opera Ensemble", "Soprano Leila Haddad", "Baritone Marco Venti"]
  },
  {
    title: "Baroque Nights",
    dates: ["2026-01-21"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Dubai Creek Club",
    image: "https://images.unsplash.com/photo-1731470093563-35cb5710354d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFyb3F1ZSUyMGNvbmNlcnR8ZW58MHx8MHx8fDA%3D",
    category: "Classical",
    description: "Step into the elegance of the Baroque era with candlelit ambiance and ornate compositions by Vivaldi, Handel, and more.",
    lineup: ["Baroque Ensemble Dubai", "The Regal Winds", "Violinist Tomas Ré"]
  },
  {
    title: "Desert Philharmonic",
    dates: ["2026-02-15"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Desert Dome",
    image: "https://images.unsplash.com/photo-1729891404858-c5895a3a48ce?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNsYXNzaWNhbCUyMGNvbmNlcnQlMjBvdXRkb29yfGVufDB8fDB8fHww",
    category: "Classical",
    description: "Where sand meets symphony—immerse yourself in classical masterpieces beneath the stars in a serene desert setting.",
    lineup: ["Desert Philharmonic", "Conductor Yasmin El Rayes", "Oasis Strings"]
  },
  // Festivals
  {
    title: "Summer Sound Festival",
    dates: ["2025-08-10"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Dubai Marina",
    image: "https://images.unsplash.com/photo-1603350902363-3141f62b7dba?w=800&auto=format&fit=crop&q=60",
    category: "Festivals",
    description: "Kick off the summer in style with an all-day celebration of music, food, and sun by the water at Dubai Marina.",
    lineup: ["DJ Solara", "The Waves", "Tropic Beats", "Urban Daze"]
  },
  {
    title: "Neon Nights Carnival",
    dates: ["2026-01-18"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Expo City Dubai",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60",
    category: "Festivals",
    description: "A glowing spectacle of lights, music, and color featuring carnival games, live DJs, and dance acts under the stars.",
    lineup: ["Electro Bloom", "Glow Troop", "DJ Mirage", "Kaleido Crew"]
  },
  {
    title: "Winter Wonderland Bash",
    dates: ["2025-12-25"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "City Walk",
    image: "https://images.unsplash.com/photo-1547829200-430afaf1fb88?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHdpbnRlciUyMHdvbmRlcmxhbmQlMjBmZXN0aXZhbHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Festivals",
    description: "Celebrate Christmas in a magical setting with festive performances, holiday treats, and snow-themed surprises for all ages.",
    lineup: ["Snow Jam Band", "The Carol Collective", "DJ North Pole", "Frosty Beats"]
  },
  {
    title: "Glow in the Dark Fest",
    dates: ["2026-02-20"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Global Village",
    image: "https://images.unsplash.com/photo-1740589960354-6bef7ab97bf7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2xvdyUyMGluJTIwdGVoJTIwZGFyayUyMGZlc3RpdmFsfGVufDB8fDB8fHww",
    category: "Festivals",
    description: "Step into a world of glowing lights, neon art, and electrifying sets at this immersive nighttime celebration.",
    lineup: ["Neon Pulse", "Lightwave Project", "DJ Glo-Fi", "The Fluoro DJs"]
  },
  {
    title: "Beach Beats",
    dates: ["2025-10-28"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "JBR Beach",
    image: "https://images.unsplash.com/photo-1704703336571-4c47c4aa73fe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJlYWNoJTIwZmVzdGl2YWx8ZW58MHx8MHx8fDA%3D",
    category: "Festivals",
    description: "Sandy toes and good vibes await at this beachside fest featuring tropical house, live sets, and sunset sessions.",
    lineup: ["DJ Breeze", "Ocean Flow", "Sandstorm Sound", "Wave Riders"]
  },
  {
    title: "Desert Fest Dubai",
    dates: ["2026-03-10"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Al Marmoom Oasis",
    image: "https://images.unsplash.com/photo-1724415057322-12c98a7d4627?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRlc2VydCUyMGZlc3RpdmFsfGVufDB8fDB8fHww",
    category: "Festivals",
    description: "Unite under the desert sky with music, art, food, and fire shows at this unique oasis festival experience.",
    lineup: ["Sahara Sound", "Nomad Vibes", "DJ Mirage", "Desert Drifters"]
  },
  // R&B
  {
    title: "Soulful Nights",
    dates: ["2025-09-22"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Bluewaters Stage",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2x1YnxlbnwwfHwwfHx8MA%3D%3D",
    category: "R&B",
    description: "A dreamy evening filled with smooth R&B ballads and soul-soothing vocals under the stars at Bluewaters.",
    lineup: ["Aaliyah Rose", "Vibe Theory", "The Midnight Notes"]
  },
  {
    title: "R&B Flow",
    dates: ["2025-10-10"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "The Vibe Lounge",
    image: "https://images.unsplash.com/photo-1597602669912-b775917b3736?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2x1YiUyMGhpcCUyMGhvcHxlbnwwfHwwfHx8MA%3D%3D",
    category: "R&B",
    description: "Get in the groove at this intimate lounge event featuring sultry R&B hits, soulful duets, and live band vibes.",
    lineup: ["Keira Blaze", "Flowline", "Jayce Harmony"]
  },
  {
    title: "Groove & Soul",
    dates: ["2025-11-11"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Zabeel House",
    image: "https://images.unsplash.com/photo-1723210730375-55395e0604ba?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNsdWIlMjBoaXAlMjBob3B8ZW58MHx8MHx8fDA%3D",
    category: "R&B",
    description: "A fusion of rhythm and soul, this cozy night blends vintage R&B classics with new-school grooves.",
    lineup: ["Groove Nation", "Siena Soul", "Rico Velvet"]
  },
  {
    title: "Slow Jam Sessions",
    dates: ["2025-12-05"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "JLT Park",
    image: "https://images.unsplash.com/photo-1735822411225-f3224b8a397b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fGNsdWIlMjBoaXAlMjBob3B8ZW58MHx8MHx8fDA%3D",
    category: "R&B",
    description: "Kick back for an evening of chilled-out slow jams, cozy park vibes, and acoustic soul performances.",
    lineup: ["The Low Keys", "Zara Amour", "Soulstice"]
  },
  {
    title: "RnB Revival",
    dates: ["2026-01-15"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Boxpark Stage",
    image: "https://images.unsplash.com/photo-1547661198-888c249734e7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm5iJTIwY29uY2VydHxlbnwwfHwwfHx8MA%3D%3D",
    category: "R&B",
    description: "Old-school meets new-school in this soulful throwback night celebrating the golden era of R&B.",
    lineup: ["The Revival Set", "Monique Elise", "90s Harmony"]
  },
  {
    title: "Golden Soul Show",
    dates: ["2026-02-28"],
    doorsOpenTime: "18:00",
    startTime: "19:00", 
    endTime: "22:00",
    location: "Dubai Design District",
    image: "https://images.unsplash.com/photo-1513104487127-813ea879b8da?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2xkJTIwaGlwJTIwaG9wfGVufDB8fDB8fHww",
    category: "R&B",
    description: "Celebrate soul and R&B legends with golden-era hits, elegant vocals, and jazzy instrumentation in a stunning setting.",
    lineup: ["Soul Remedy", "Velvet Gold", "DJ Smooth-T"]
  }  
];

export default mockEvents;

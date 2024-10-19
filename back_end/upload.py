import firebase_admin
from firebase_admin import credentials, db

# Initialize Firebase
cred = credentials.Certificate('path_to_your_firebase_credentials.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://your-database-url.firebaseio.com/'
})

ref = db.reference('/animals')

# Flamingo data
flamingo_data = {
    "habitat": "Lakes, lagoons, mangrove swamps",
    "diet": "Omnivorous, feeds on algae, crustaceans",
    "behavior": "Known for group living, synchronized dancing",
    "conservation_status": "Near Threatened",
    "migration_patterns": "Long-distance migrations",
    "lifespan": "20-30 years",
    "file_link": "link_to_diet_data_file"
}
ref.child('flamingo').set(flamingo_data)

# Lion data
lion_data = {
    "habitat": "Grasslands, savannahs, and open woodlands",
    "diet": "Carnivorous, primarily hunts large ungulates",
    "behavior": "Social, lives in prides, territorial",
    "conservation_status": "Vulnerable",
    "reproduction": "Cubs stay with the pride for 2 years",
    "lifespan": "10-14 years in the wild",
    "human_interaction": "Occasionally involved in conflicts due to livestock",
    "file_link": "link_to_lion_data_file"
}
ref.child('lion').set(lion_data)

# Tiger data
tiger_data = {
    "habitat": "Tropical forests, grasslands, and swamps",
    "diet": "Carnivorous, preys on deer, boar, and other large animals",
    "behavior": "Solitary, highly territorial",
    "conservation_status": "Endangered",
    "reproduction": "Gestation lasts about 3.5 months",
    "lifespan": "10-15 years in the wild",
    "human_interaction": "Poaching and habitat loss are major threats",
    "file_link": "link_to_tiger_data_file"
}
ref.child('tiger').set(tiger_data)

# Giraffe data
giraffe_data = {
    "habitat": "Savannahs, grasslands, and open woodlands",
    "diet": "Herbivorous, primarily feeds on acacia leaves",
    "behavior": "Social, lives in loose groups",
    "conservation_status": "Vulnerable",
    "reproduction": "Gestation lasts about 15 months",
    "lifespan": "25 years in the wild",
    "human_interaction": "Often featured in zoos and safari tours",
    "file_link": "link_to_giraffe_data_file"
}
ref.child('giraffe').set(giraffe_data)

# Cheetah data
cheetah_data = {
    "habitat": "Grasslands, savannahs, and deserts",
    "diet": "Carnivorous, preys on small to medium-sized ungulates",
    "behavior": "Solitary or small family groups",
    "conservation_status": "Vulnerable",
    "reproduction": "Gestation lasts about 3 months",
    "lifespan": "10-12 years in the wild",
    "human_interaction": "Habitat loss and poaching are major threats",
    "file_link": "link_to_cheetah_data_file"
}
ref.child('cheetah').set(cheetah_data)

# Penguin data
penguin_data = {
    "habitat": "Antarctic and subantarctic regions",
    "diet": "Carnivorous, feeds on fish, squid, and krill",
    "behavior": "Highly social, often nests in colonies",
    "conservation_status": "Least Concern to Endangered depending on species",
    "reproduction": "Lay eggs, incubated by one parent",
    "lifespan": "15-20 years",
    "human_interaction": "Threats include climate change and fishing nets",
    "file_link": "link_to_penguin_data_file"
}
ref.child('penguin').set(penguin_data)

# Kangaroo data
kangaroo_data = {
    "habitat": "Grasslands, forests, and savannahs in Australia",
    "diet": "Herbivorous, primarily feeds on grass",
    "behavior": "Social, lives in groups called mobs",
    "conservation_status": "Least Concern",
    "reproduction": "Births a single joey after a month of gestation",
    "lifespan": "6-8 years in the wild",
    "human_interaction": "Commonly seen near human settlements",
    "file_link": "link_to_kangaroo_data_file"
}
ref.child('kangaroo').set(kangaroo_data)

# Polar Bear data
polar_bear_data = {
    "habitat": "Arctic region, sea ice, and coastal areas",
    "diet": "Carnivorous, primarily feeds on seals",
    "behavior": "Solitary, strong swimmers",
    "conservation_status": "Vulnerable",
    "reproduction": "Cubs stay with mothers for 2-3 years",
    "lifespan": "15-18 years in the wild",
    "human_interaction": "Threats include climate change and hunting",
    "file_link": "link_to_polar_bear_data_file"
}
ref.child('polar_bear').set(polar_bear_data)

# Gorilla data
gorilla_data = {
    "habitat": "Tropical and subtropical forests",
    "diet": "Herbivorous, feeds on fruits, leaves, and stems",
    "behavior": "Social, lives in groups led by a silverback male",
    "conservation_status": "Critically Endangered",
    "reproduction": "Gestation lasts about 8.5 months",
    "lifespan": "35-40 years in the wild",
    "human_interaction": "Threats include poaching and habitat destruction",
    "file_link": "link_to_gorilla_data_file"
}
ref.child('gorilla').set(gorilla_data)

# Dolphin data
dolphin_data = {
    "habitat": "Oceans and rivers worldwide",
    "diet": "Carnivorous, primarily feeds on fish and squid",
    "behavior": "Highly social, lives in pods",
    "conservation_status": "Varies by species, from Least Concern to Endangered",
    "reproduction": "Gestation lasts 10-12 months",
    "lifespan": "20-50 years depending on species",
    "human_interaction": "Often used in marine parks and shows",
    "file_link": "link_to_dolphin_data_file"
}
ref.child('dolphin').set(dolphin_data)

# Wolf data
wolf_data = {
    "habitat": "Forests, grasslands, tundra, and mountains",
    "diet": "Carnivorous, hunts in packs for deer, elk, and other large prey",
    "behavior": "Highly social, lives in packs",
    "conservation_status": "Least Concern to Endangered depending on region",
    "reproduction": "Gestation lasts about 2 months",
    "lifespan": "6-8 years in the wild",
    "human_interaction": "Often involved in human-wildlife conflicts",
    "file_link": "link_to_wolf_data_file"
}
ref.child('wolf').set(wolf_data)

# Zebra data
zebra_data = {
    "habitat": "Savannahs and grasslands",
    "diet": "Herbivorous, primarily feeds on grass",
    "behavior": "Social, forms large herds",
    "conservation_status": "Near Threatened",
    "reproduction": "Gestation lasts about 12-13 months",
    "lifespan": "20-25 years in the wild",
    "human_interaction": "Often featured in safaris and zoos",
    "file_link": "link_to_zebra_data_file"
}
ref.child('zebra').set(zebra_data)

# Orangutan data
orangutan_data = {
    "habitat": "Tropical rainforests in Borneo and Sumatra",
    "diet": "Omnivorous, feeds on fruit, leaves, and insects",
    "behavior": "Solitary, uses tools to gather food",
    "conservation_status": "Critically Endangered",
    "reproduction": "Gestation lasts about 8.5 months",
    "lifespan": "30-40 years in the wild",
    "human_interaction": "Threats include deforestation and illegal pet trade",
    "file_link": "link_to_orangutan_data_file"
}
ref.child('orangutan').set(orangutan_data)

# Rhino data
rhino_data = {
    "habitat": "Savannahs and forests",
    "diet": "Herbivorous, feeds on grasses and leaves",
    "behavior": "Solitary or small groups",
    "conservation_status": "Critically Endangered",
    "reproduction": "Gestation lasts about 16-18 months",
    "lifespan": "35-40 years in the wild",
    "human_interaction": "Poaching for horns is a major threat",
    "file_link": "link_to_rhino_data_file"
}
ref.child('rhino').set(rhino_data)

# Elephant Seal data
elephant_seal_data = {
    "habitat": "Coastal regions, often seen in subantarctic islands",
    "diet": "Carnivorous, primarily feeds on fish and squid",
    "behavior": "Lives in colonies, highly territorial during mating season",
    "conservation_status": "Least Concern",
    "reproduction": "Gestation lasts about 11 months",
    "lifespan": "14-22 years in the wild",
    "human_interaction": "Occasionally caught in fishing nets",
    "file_link": "link_to_elephant_seal_data_file"
}
ref.child('elephant_seal').set(elephant_seal_data)

# Koala data
koala_data = {
    "habitat": "Eucalyptus forests in Australia",
    "diet": "Herbivorous, feeds on eucalyptus leaves",
    "behavior": "Solitary, sleeps up to 20 hours a day",
    "conservation_status": "Vulnerable",
    "reproduction": "Gestation lasts about 35 days",
    "lifespan": "10-12 years in the wild",
    "human_interaction": "Habitat loss due to urbanization is a major threat",
    "file_link": "link_to_koala_data_file"
}
ref.child('koala').set(koala_data)


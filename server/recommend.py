import numpy as np
import numpy.random as rand
import pickle
import json

class Podcast:
    def __init__(self, title, vec):
        self.title = title
        self.vec = np.array(vec)

    def cosine(self, v):
        return (np.transpose(self.vec) * v)/(np.linalg.norm(self.vec) * np.linalg.norm(v))

#def gen_podcasts(n):
#    podcasts = [Podcast(str(i), v) for i, v in enumerate([np.array([i, 1]) for i in range(n)])]
#    return podcasts

def add_like(user_id, title):
    liked = pickle.load("likes.pkl")
    if not user_id in liked:
        liked[user_id] = set()

    liked[user_id].add(title)

    pickle.dump(liked, "likes.pkl")

    return json.dump(liked)

def get_rec(user_id, n = 1):
    liked = pickle.load("likes.pkl")

    df = pandas.read_csv("trained_embeddings.csv")
    podcasts = {row['title']:Podcast(row['title'], row['vec']) for i, row in df.iterrows()}
    
    distances = {podcast.title:0 for podcast in podcasts}
    for like in liked:
        temp_distances = {podcast.title: podcasts[like].cosine(podcast) for podcast in podcasts}
        
        for title, distance in temp_distances:
            distances[title] *= distance

    distances = [(k, v) for k,v in distances]

    distances.sort(key=lambda kv: kv[1])

    return json.dumps(distance[:n])

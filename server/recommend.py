import numpy as np
import numpy.random as rand
import pickle
import json
import pandas
from subprocess import call

class Podcast:
    def __init__(self, title, vec, rss):
        self.title = title
        self.vec = np.array(vec)
        self.rss = rss

    def cosine(self, p):
        v = p.vec
        num = np.dot(v,self.vec)
        denom = np.linalg.norm(self.vec) * np.linalg.norm(v)

        res = num / denom

        return res

def add_like(user_id, title):
    liked = {}
    try:
        with open("likes.json", "r") as flike:
            liked = json.load(flike)
    except FileNotFoundError as ex:
        print("No file found, setting liked = {}")



    if not user_id in liked:
        liked[user_id] = []

    if not title in liked[user_id]:
        liked[user_id].append(title)

    try:
        with open("likes.json", "w") as flike:
            json.dump(liked, flike)
    except FileNotFoundError as ex:
        print("No file found, setting liked = {}")

    return json.dumps(liked[user_id])

def get_rec(user_id, n = 1):
    liked = {}
    try:
        with open("likes.json", 'r') as flike:
            liked = json.load(flike)
    except FileNotFoundError as ex:
        print("No file found, setting liked = {}")

    df = pandas.read_json("trained_embeddings.json")
    podcasts = {
            row['title']:
                Podcast(row['title'], row['vector'], row['rss']) 
            for i, row in df.iterrows()}

    if user_id not in liked:
        print("USER NOT FOUND")
        return ""

    distances = {title:1 for title, podcasts in podcasts.items()}
    for title in liked[user_id]:
        temp_distances = [(podcast.title, podcasts[title].cosine(podcast)) for _, podcast in podcasts.items()]
        for p_title, distance in temp_distances:
            distances[p_title] *= distance
    
    res_dists = [(k, d) for k, d in distances.items() if d != 0]

    res_dists.sort(key=lambda kv: kv[1])

    
    return [
        {
            'title':podcasts[title].title, 
            'rss':podcasts[title].rss
        }
        for title, dist in res_dists[:n]]

add_like("cjen1", "Nobody Told Me!")


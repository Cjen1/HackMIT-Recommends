import numpy as np
import numpy.random as rand

class podcast:
    def __init__(self, url, vec):
        self.url = url
        self.vec = np.array(vec)

    def cosine(self, v):
        return (np.transpose(self.vec) * v)/(np.linalg.norm(self.vec) * np.linalg.norm(v))

    def get_recs(self, podcasts, n = 1):
        angles = []
        for podcast in podcasts:
            angle = self.cosine(podcast.vec)
            if angle != 0:
                angles.append(podcast, angle)
        angles.sort(key=lambda a: a[angle])
        return angles

def gen_podcasts(n):
    podcasts = [podcast(str(i), v) for i, v in enumerate([np.array([i, 1]) for i in range(n)])]
    return podcasts

def get_rec(user_id):
    liked = []
    for like in liked:
        
    return user_id

        

from sklearn.cluster import KMeans
from fractions import gcd
from PIL import Image
import colorsys as cs
import math


def get_main_colors(filename, n_colors=7, use_hsv=True):
    img = Image.open(filename).convert('RGB')
    div = gcd(img.size[0], img.size[1])
    new_size = (img.size[0] // div, img.size[1] // div)
    img = img.resize(new_size, Image.NEAREST)

    if use_hsv:
        x_data = [cs.rgb_to_hsv(*x) for x in set(img.getdata())]
    else:
        x_data = list(set(img.getdata()))

    labels = KMeans(n_clusters=n_colors, random_state=0).fit_predict(x_data)
    labels_count = len(set(labels))
    clusters = [[] for _ in range(labels_count)]
    for item, label in zip(x_data, labels):
        clusters[label].append(item)
    clusters.sort()

    result_colors = []
    for line in clusters:
        if use_hsv:
            color = tuple(map(math.ceil, cs.hsv_to_rgb(*line[0])))
            result_colors.append(color)
        else:
            result_colors.append(line[0])

    return result_colors

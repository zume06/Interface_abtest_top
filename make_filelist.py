import json
import random

with open("./data/database.json", "r") as f:
    database = json.load(f)

out_dict = {}
for test_id in database:
    out_dict[test_id] = {}
    i = 0
    random_seed = random.randint(0, 1)
    while f"query{i}" in database[test_id]:
        out_dict[test_id][f"query{i}"] = {}
        out_dict[test_id][f"query{i}"]["inst"] = database[test_id][f"query{i}"]["inst"]
        out_dict[test_id][f"query{i}"]["audio_path"] = database[test_id][f"query{i}"]["audio_path"]
        i +=1
    
    if random_seed == 0:
        out_dict[test_id]["a"] = database[test_id]["retrieved"]["audio_path"]
        out_dict[test_id]["b"] = database[test_id]["retrieved_comp"]["audio_path"]
        out_dict[test_id]["true"]="a"
    elif random_seed == 1:
        out_dict[test_id]["a"] = database[test_id]["retrieved_comp"]["audio_path"]
        out_dict[test_id]["b"] = database[test_id]["retrieved"]["audio_path"]
        out_dict[test_id]["true"]="b"
    else:
        print("error")
    out_dict[test_id]["num_query"] = database[test_id]["num_query"]

with open("./data/file_list.json", "w") as f:
    json.dump(out_dict, f)
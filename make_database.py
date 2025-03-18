import json
import os
import re

out_dict = {}

for testname in sorted(os.listdir("./data/samples")):
    test_num = re.sub("test", "", testname)
    out_dict[test_num]={}
    with open(f"./data/samples/{testname}/config.json", "r") as f:
        query_dict = json.load(f)
    for idx, file_name in enumerate(sorted(os.listdir(f"./data/samples/{testname}/queries"))):
        out_dict[test_num][f"query{idx}"]={}
        out_dict[test_num][f"query{idx}"]["inst"] = query_dict["queries"][f"query{idx}"]["inst"]
        out_dict[test_num][f"query{idx}"]["audio_path"] = f"./data/samples/{testname}/queries/{file_name}"
    out_dict[test_num]["num_query"]= idx + 1
    out_dict[test_num]["retrieved"] = {}
    out_dict[test_num]["retrieved"]["audio_path"] = f"./data/samples/{testname}/retrieved.mp3"
    out_dict[test_num]["retrieved_comp"]={}
    out_dict[test_num]["retrieved_comp"]["audio_path"] = f"./data/samples/{testname}/retrieved_comp.mp3"

with open ("./data/database.json", "w") as f:
    json.dump(out_dict, f)
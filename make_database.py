import json
import os
import re

out_dict = {}

for testname in sorted(os.listdir("./data/samples")):
    test_num = re.sub("test", "", testname)
    out_dict[test_num]={}
    for idx, file_name in enumerate(sorted(os.listdir(f"./data/samples/{testname}/queries"))):
        out_dict[test_num][f"query{idx}"]={}
        out_dict[test_num][f"query{idx}"]["inst"] = file_name.split(".")[0].split("_")[1]
        out_dict[test_num][f"query{idx}"]["audio_path"] = f"./data/samples/{testname}/queries/{file_name}"
    out_dict[test_num]["num_query"]= idx + 1
    out_dict[test_num]["retrieved"] = {}
    out_dict[test_num]["retrieved"]["audio_path"] = f"./data/samples/{testname}/retrieved.mp3"

with open ("./data/database.json", "w") as f:
    json.dump(out_dict, f)
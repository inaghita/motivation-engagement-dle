import csv, os, sys, json
if len(sys.argv) < 2:
    print(" ERROR: Number of ubertopics not specified!")
    print(" Usage: python generate-graph-json.py N")
    print(" Where N = number of ubertopics.")
    print(" Exiting...")
    sys.exit()
else:
    print(sys.argv[1] + " ubertopics.")
    ubertopics = int(sys.argv[1])

fnames = open("topics-graph-names.json", "w")
with open('topics-matrix.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    row_count = 0
    row_total = sum(1 for row in csv_reader) - 1 # Get number of rows (w/o header)
    csv_file.seek(0) # Rewind file
    next(csv_reader) # To skip header
    names = []
    # Collect names. Has to be done first for group mapping
    for row in csv_reader:
        names.append(row[0])
    csv_file.seek(0) # Rewind file
    next(csv_reader) # To skip header again
    row_count = 0
    nodes = []
    for row in csv_reader:
        group = row_count
        for col in range(len(names)):
            if row[col] == "1":
                group = col-1
        if row_count < ubertopics:
            x = {"id": row[0],"group": str(group),"uberTopic": 1}
        else:
            x = {"id": row[0],"group": str(group),"uberTopic": 0}
        nodes.append(x)
        row_count += 1
    csv_file.seek(0) # Rewind file
    next(csv_reader) # To skip header again
    row_count = 0
    links = []
    for row in csv_reader:
        for col in range(1,len(names)+1):
            if(row[col] != ''):
                x = {"source":row[0], "target": names[col-1], "value":str(3-int(row[col])) }
                links.append(x)
    # Let's do it again as some graph libraries expect links between names as opposed to indexes:
    obj = json.dumps({"nodes": nodes, "links": links}).replace("}, {","},\n{").replace("], ","],\n")
    fnames.write(obj)
fnames.close()
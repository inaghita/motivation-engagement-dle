import csv, os

findex = open("topics-graph.json", "w")
fnames = open("topics-graph-names.json", "w")
with open('topics-matrix.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    row_count = 0
    row_total = sum(1 for row in csv_reader) - 1 # Get number of rows (w/o header)
    csv_file.seek(0) # Rewind file
    next(csv_reader) # To skip header
    findex.write('{"nodes":[\n')
    fnames.write('{"nodes":[\n')
    names = []
    # Collect names. Has to be done first for group mapping
    for row in csv_reader:
        names.append(row[0])
    csv_file.seek(0) # Rewind file
    next(csv_reader) # To skip header again
    row_count = 0
    for row in csv_reader:
        group = row_count
        for col in range(len(names)):
            if row[col] == "1":
                group = col-1
        findex.write('\t{"name":"' + row[0] + '","group":' + str(group) + '}')
        if row_count < 7:
            fnames.write('\t{"id":"' + row[0] + '","group":' + str(group) + ',"uberTopic":1}')
        else:
            fnames.write('\t{"id":"' + row[0] + '","group":' + str(group) + ',"uberTopic":0}')
        row_count += 1
        if(row_count < row_total):
            findex.write(',\n')
            fnames.write(',\n')
        else:
            findex.write('\n\t],\n')
            fnames.write('\n\t],\n')
    findex.write('"links":[\n')
    fnames.write('"links":[\n')
    csv_file.seek(0) # Rewind file
    next(csv_reader) # To skip header again
    row_count = 0
    for row in csv_reader:
        for col in range(1,len(names)+1):
            if(row[col] != ''):
                findex.write('\t{"source":' + str(row_count) + ',"target":' + str(col-1) + ',"value":' + str(3-int(row[col])) + '}')
                fnames.write('\t{"source":"' + row[0] + '","target":"' + names[col-1] + '","value":' + str(3-int(row[col])) + '}')
                if(row_count < row_total-1):
                    findex.write(',\n')
                    fnames.write(',\n')
                else:
                    findex.write('\n\t]\n}')
                    fnames.write('\n\t]\n}')
        row_count += 1
    # Let's do it again as some graph libraries expect links between names as opposed to indexes:
findex.close()
fnames.close()
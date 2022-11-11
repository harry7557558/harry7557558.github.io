% https://www.thingiverse.com/thing:151081
[vertices, triangles] = stlRead("Bunny-LowPoly.stl");
vmin = min(vertices, [], 1);
vmax = max(vertices, [], 1);
vertices = (vertices - (0.5*(vmin+vmax))) .* (2/max(vmax-vmin));
triangles = triangles - 1;
edges = cat(1, triangles(:, [1, 2]), triangles(:, [1, 3]), triangles(:, [2, 3]));
edges = sort(edges, 2);
edges = unique(edges, 'rows');

vs = mat2str(1e-6*round(1e6*vertices(:, 1:3)));
vs = strrep(strrep(vs, '[', '"'), ']', '"');
vs = ['"vertices": ' vs ',' newline];
es = mat2str(edges);
es = strrep(strrep(es, '[', '"'), ']', '"');
es = ['"edges": ' es '' newline];
output = [vs es]
save "temp.txt" output


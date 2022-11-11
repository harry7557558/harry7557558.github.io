% UV sphere, 20 longitudinal 10 latitudinal

vertices = zeros(21*11, 3);
indices = zeros(21*11, 10);
index = 1;
for i = 0:20
    for j = 0:10
        theta = 2*pi*i/20;
        phi = pi*j/10;
        vertices(index, :) = [
            cos(theta)*sin(phi),
            sin(theta)*sin(phi),
            cos(phi)
        ];
        indices(i+1, j+1) = index;
        index = index + 1;
    end
end

edges = [];
for i = 1:20
    for j = 1:10
        edges(end+1, :) = [indices(i, j), indices(i+1,j)];
        edges(end+1, :) = [indices(i, j), indices(i, j+1)];
    end
end

edges = edges - 1;
vs = mat2str(1e-6*round(1e6*vertices(:, 1:3)));
vs = strrep(strrep(vs, '[', '"'), ']', '"');
vs = ['"vertices": ' vs ',' newline];
es = mat2str(edges);
es = strrep(strrep(es, '[', '"'), ']', '"');
es = ['"edges": ' es '' newline];
output = [vs es]
save "temp.txt" output


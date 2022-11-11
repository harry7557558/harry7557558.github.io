% 4x4x4 grid

vertices = zeros(125, 3);
indices = zeros(5, 5, 5);
index = 1;
for i = -2:2
    for j = -2:2
        for k = -2:2
            vertices(index, :) = [i, j, k];
            indices(i+3, j+3, k+3) = index;
            index = index + 1;
        end
    end
end

edges = [];
for i = 1:5
    for j = 1:5
        for k = 1:5
            if i ~= 5
                edges(end+1, :) = [indices(i, j, k), indices(i+1, j, k)];
            end
            if j ~= 5
                edges(end+1, :) = [indices(i, j, k), indices(i, j+1, k)];
            end
            if k ~= 5
                edges(end+1, :) = [indices(i, j, k), indices(i, j, k+1)];
            end
        end
    end
end

vertices = vertices * 0.5;
edges = edges - 1;
vs = mat2str(vertices(:, 1:3));
vs = strrep(strrep(vs, '[', '"'), ']', '"');
vs = ['"vertices": ' vs ',' newline];
es = mat2str(edges);
es = strrep(strrep(es, '[', '"'), ']', '"');
es = ['"edges": ' es '' newline];
output = [vs es]
save "temp.txt" output


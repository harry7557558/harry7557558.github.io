% UV torus
uN = 20;
vN = 10;
R = 0.75;
r = 0.25;

vertices = zeros(uN*vN, 3);
indices = zeros(uN, vN);
index = 0;
for i = 0:uN-1
    for j = 0:vN-1
        theta = 2*pi*i/uN;
        phi = 2*pi*j/vN;
        vertices(index+1, :) = [
            cos(theta)*(R+r*cos(phi)),
            sin(theta)*(R+r*cos(phi)),
            r*sin(phi)
        ];
        indices(i+1, j+1) = index;
        index = index + 1;
    end
end

edges = [];
for i = 1:uN
    for j = 1:vN
        edges(end+1, :) = [indices(i, j), indices(mod(i,uN)+1,j)];
        edges(end+1, :) = [indices(i, j), indices(i, mod(j,vN)+1)];
    end
end

vs = mat2str(1e-6*round(1e6*vertices(:, 1:3)));
vs = strrep(strrep(vs, '[', '"'), ']', '"');
vs = ['"vertices": ' vs ',' newline];
es = mat2str(edges);
es = strrep(strrep(es, '[', '"'), ']', '"');
es = ['"edges": ' es '' newline];
output = [vs es]
save "temp.txt" output


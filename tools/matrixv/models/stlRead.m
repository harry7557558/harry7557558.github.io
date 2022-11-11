% for Octave

function [vs, ts] = stlRead(filename)

  fp = fopen(filename);
  fseek(fp, 80);

  fn = fread(fp, 1, 'uint32');

  vs = zeros(3*fn, 3);
  ts = zeros(fn, 3);

  for i = 1:fn
    buffer = fread(fp, 12, 'float32');
    vs(3*i-2, :) = buffer(4:6);
    vs(3*i-1, :) = buffer(7:9);
    vs(3*i, :) = buffer(10:12);
    ts(i, :) = 3*i-2:3*i;
    fread(fp, 2, 'uint8');
  end

  fclose(fp);

  [vs, i, j] = unique(vs, 'rows');
  ts = j(ts);

end


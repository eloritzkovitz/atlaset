import * as React from "react";

const JS = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 640 480" {...props}>
    <g>
      <rect width="640" height="160" y="0" fill="#418c34" />
      <rect width="640" height="160" y="160" fill="#fff" />
      <rect width="640" height="160" y="320" fill="#d21034" />      
      <polygon
        points="320,200 332,236 370,236 338,256 350,292 320,270 290,292 302,256 270,236 308,236"
        fill="#000"
      />
    </g>
  </svg>
);

export default JS;

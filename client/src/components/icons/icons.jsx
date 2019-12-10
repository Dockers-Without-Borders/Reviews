import React from 'react';
import { tsExpressionWithTypeArguments, genericTypeAnnotation } from '@babel/types';

export const ICONS = {
  message: {
    viewbox: "0 0 18 18",
    path: 
      "M2 4v6a2 2 0 0 0 2 2h1v3l4-3h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"
  },
  share: {
    viewbox: "0 0 18 18",
    path:
      "M17.714 6.43L13 10.356v-3.03c-1 0-5.097 1.47-6.286 3.62.274-3.08 4.286-5.5 6.286-5.5V2.5l4.714 3.93zM3 4v10h11v-2.5l1-1V15H2V3h8.5l-1 1H3z"
  },
  embed: {
    viewbox: "0 0 18 18",
    path:
      "M12.503 13.76a.717.717 0 0 1-.526.23.717.717 0 0 1-.526-.23.822.822 0 0 1 0-1.117l3.444-3.652-3.444-3.65a.822.822 0 0 1 0-1.116.714.714 0 0 1 1.053 0l4.495 4.77-4.495 4.767zm-5.954 0a.717.717 0 0 1-.528.23.718.718 0 0 1-.526-.23L1.002 8.99l4.495-4.768a.714.714 0 0 1 1.052 0c.29.308.29.808 0 1.116L3.105 8.99l3.442 3.653c.29.308.29.808 0 1.116z"
  },
  compliment: {
    viewbox: "0 0 18 18",
    path:
    "M14.5 6.75a5.5 5.5 0 0 0-11 0 5.495 5.495 0 0 0 2.993 4.892L5.5 16.75l3.505-2 3.495 2-.993-5.108A5.495 5.495 0 0 0 14.5 6.75zm-5.5 4c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"
  },
  follow: {
    viewbox: "0 0 18 18",
    path:
    "M16 13l-4 3v-2H9l1-2h2v-2l4 3zm-8.925 2.383c-.443.817-1.707.817-2.15 0L2.128 9.605C1.728 8.868 2.31 8 3.203 8h5.594c.893 0 1.474.868 1.075 1.605l-2.797 5.778zM6 7a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
  },
  photo: {
    viewbox: "0 0 18 18",
    path:
    "M15 15H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2zM9 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
  },
  friends: {
    viewbox: "0 0 18 18",
    path:
      "M7.904 9.43l-2.098 4.697a.9.9 0 0 1-1.612 0L2.096 9.43a.902.902 0 0 1 .806-1.305h4.196c.67 0 1.105.705.806 1.305zM5 7.375a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M15.904 9.43l-2.098 4.697a.89.89 0 0 1-.806.498.89.89 0 0 1-.806-.498L10.096 9.43a.902.902 0 0 1 .806-1.305h4.195c.67 0 1.106.705.807 1.305zM13 7.375a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
  },
  search: {
    viewbox: "0 0 18 18",
    path:
    "M15.913 14.224a1.324 1.324 0 0 0-.3-.466h.01l-3.378-3.376a5.49 5.49 0 0 0 .802-2.857 5.523 5.523 0 1 0-5.522 5.52 5.49 5.49 0 0 0 2.856-.8l3.37 3.368.006.003a1.364 1.364 0 0 0 .93.384C15.41 16 16 15.41 16 14.684c0-.163-.032-.317-.086-.46zM7.525 10.94a3.422 3.422 0 0 1-3.418-3.416 3.422 3.422 0 0 1 3.418-3.417 3.422 3.422 0 0 1 3.416 3.417 3.42 3.42 0 0 1-3.413 3.416z"
  },
  arrow: {
    viewbox: "0 0 48 48",
    fill: '#808080',
    width: '48',
    height: '48',
    path:
    "M18.586 42.008a2.518 2.518 0 0 1-1.614-.588c-1.115-.925-1.296-2.613-.404-3.77L27.098 24l-10.53-13.65c-.892-1.156-.71-2.844.404-3.77 1.116-.924 2.743-.737 3.635.42L32.43 22.325a2.76 2.76 0 0 1 0 3.35L20.606 41.002a2.548 2.548 0 0 1-2.02 1.008z"
  }
}

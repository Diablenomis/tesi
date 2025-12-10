import { Grid, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { IPackCardDetailLevel } from "../models/ComponentInterface";

export const PackCardDetailDescription: React.FC<IPackCardDetailLevel> = ({
  packLevel,
}) => {
  const [text, setText] = useState<string[]>([]);

  useEffect(() => {
    if (packLevel && packLevel.duration !== "") {
      adaptText();
    }
  }, [packLevel]);

  const adaptText = () => {
    let textRows = packLevel.description.split("\n");
    setText(textRows);
  };

  return (
    <div className="panel m-0 p-0 pb-3 col-12 container-fluid little-card zoom-in">
      <div className="col-12 m-0 py-0 row pack-card-detail-header padding-page-half container-fluid">
        <div className="m-0 p-0 col row">
          <div className="col m-auto pack-card-level-icon-size pack-card-detail-steps-icon footer-icon-size p-0"></div>
          <div className="col m-0">
            <span className="pack-card-detail-title no-pm text-font-big">
              Descrizione
            </span>
          </div>
        </div>
      </div>
      <div className="col-12 py-0 m-0 mt-3 mb-3 pack-card-body padding-page-half">
        <Grid item xs={12} md={6} className="no-pm">
          <List dense={true} className="no-pm">
            {text &&
              text.map((textRow, index) => (
                <ListItem className="no-pm" key={index}>
                  <ListItemText primary={textRow} />
                </ListItem>
              ))}
          </List>
        </Grid>
      </div>
    </div>
  );
};

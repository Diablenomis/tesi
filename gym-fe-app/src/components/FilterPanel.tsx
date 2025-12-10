interface IFilterPanel {
  type: string;
  title: string;
  data: any
}

export const FilterPanel: React.FC<IFilterPanel> = ({ type, title, data }) => {

  return (
    <div className="panel col-12 m-0 p-0 row">
        <div className="col-4 m-0 p-0">
            <span className="font25x600">{ title }</span>
        </div>
        <div className="col-8 m-0 p-0">

        </div>
    </div>
  );
};

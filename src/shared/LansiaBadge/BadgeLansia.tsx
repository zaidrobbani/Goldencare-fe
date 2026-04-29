import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const BadgeLansia = () => {
  return (
    <div className="flex items-center gap-2 bg-surface-container rounded-2xl px-3 py-2 border border-outline-variant">
      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
        <AccountCircleOutlinedIcon fontSize="small" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold font-headline text-on-surface leading-tight">
          Eleanor Vance
        </span>
        <span className="text-xs text-on-surface-variant font-body">Room 302</span>
      </div>
      <KeyboardArrowDownIcon fontSize="small" className="text-on-surface-variant ml-1" />
    </div>
  );
};

export default BadgeLansia;

import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

function AppBar(props) {
	const { desktop, toggleDrawer } = props;

	return (
		<MuiAppBar position="static" elevation={0}>
			<Toolbar>
				{!desktop ? (
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
						onClick={() => toggleDrawer(true)}
					>
						<MenuIcon />
					</IconButton>
				) : null}
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					OSOP
				</Typography>
			</Toolbar>
		</MuiAppBar>
	);
}

export default AppBar;

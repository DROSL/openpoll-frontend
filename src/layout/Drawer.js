import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

const links = [
	{
		name: "Impressum",
		url: "/impressum",
	},
	{
		name: "Datenschutzerklärung",
		url: "/datenschutzerklaerung",
	},
	{
		name: "Nutzungsbedingungen",
		url: "/nutzungsbedingungen",
	},
];

function Drawer(props) {
	const { open, toggleDrawer } = props;
	const handleClose = () => {
		toggleDrawer(false);
	};

	return (
		<MuiDrawer anchor="left" open={open} onClose={handleClose}>
			<Box sx={{ width: 250 }}>
				<List>
					<ListItem>
						<ListItemText
							primary={"OpenPoll"}
							secondary={"Version 1.0"}
						/>
					</ListItem>
				</List>
				<Divider />
				<List>
					{links.map((link, index) => (
						<ListItem
							key={`drawer-${index}`}
							component={Link}
							to={link.url}
							button
							onClick={handleClose}
						>
							<ListItemText primary={link.name} />
						</ListItem>
					))}
				</List>
				<Divider />
				<List>
					<ListItem
						component={Link}
						to="/"
						button
						onClick={handleClose}
					>
						<ListItemText
							primary={
								<Typography color="error">Beenden</Typography>
							}
						/>
					</ListItem>
				</List>
			</Box>
		</MuiDrawer>
	);
}

export default Drawer;

import { Link } from "react-router-dom";

import MuiLink from "@mui/material/Link";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

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
							primary={"OSOP"}
							secondary={"Version 1.0"}
						/>
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListItem
						component={MuiLink}
						href="https://www.ovgu.de/Impressum.html"
						target="_blank"
						button
						onClick={handleClose}
					>
						<ListItemText primary="Impressum" />
					</ListItem>
					<ListItem
						component={MuiLink}
						href="https://www.ovgu.de/datenschutzerklaerung.html"
						target="_blank"
						button
						onClick={handleClose}
					>
						<ListItemText primary="Datenschutzerklärung" />
					</ListItem>
					<ListItem
						component={Link}
						to="/nutzungsbedingungen"
						button
						onClick={handleClose}
					>
						<ListItemText primary="Nutzungsbedingungen" />
					</ListItem>
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

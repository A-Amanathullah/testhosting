import React, { useState, useEffect } from 'react';
// import { useAppSelector } from '../../state/store'; // Import your custom hook if needed
// import { fetchRoles } from '../../state/slices/roleSlice'; // Import your thunk action if needed
// import { Role } from '../../models/Role'; // Import your Role model if needed

// Define modules, submodules, and actions
const modules = [
	{
		name: 'Dashboard',
		actions: ['view', 'edit'],
	},
	{
		name: 'Bus Schedule',
		actions: ['view', 'add', 'edit', 'delete'],
	},
	{
		name: 'Bus Register',
		actions: ['view', 'add', 'edit', 'delete'],
	},
	{
		name: 'Booking Management',
		submodules: [
			{ name: 'Booking List', actions: ['view', 'print'] },
			{ name: 'Cancellation List', actions: ['view', 'print'] },
		],
	},
	{
		name: 'Staff Management',
		submodules: [
			{ name: 'Staff List', actions: ['view', 'add', 'edit', 'delete', 'print'] },
			{ name: 'Role Access Management', actions: ['view', 'edit'] },
		],
	},
	{
		name: 'Report',
		submodules: [
			{ name: 'Bus Booking Report', actions: ['view', 'print'] },
			{ name: 'Cancellation Report', actions: ['view', 'print'] },
			{ name: 'Agentwise Report', actions: ['view', 'print'] },
			{ name: 'Revenue Report', actions: ['view', 'print'] },
			{ name: 'Loyalty Report', actions: ['view', 'print'] },
		],
	},
	{
		name: 'Bus Tracking',
		actions: ['view'],
	},
	{
		name: 'Loyalty Management',
		submodules: [
			{ name: 'Loyalty Card', actions: ['view', 'add', 'edit', 'delete'] },
			{ name: 'Loyalty Report', actions: ['view', 'print'] },
		],
	},
	{
		name: 'User Management',
		actions: ['view', 'add', 'edit', 'delete'],
	},
	{
		name: 'SMS Template',
		actions: ['view', 'add', 'edit', 'delete'],
	},
	{
		name: 'Profile',
		actions: ['view', 'edit'],
	},
];

// Generate initial permissions object
const generateInitialPermissions = (roles) => {
	const perms = {};
	(roles || []).forEach((role) => {
		perms[role] = {};
		modules.forEach((mod) => {
			if (mod.submodules) {
				mod.submodules.forEach((sub) => {
					perms[role][sub.name] = { module: true };
					sub.actions.forEach((action) => {
						perms[role][sub.name][action] = true;
					});
				});
			} else {
				perms[role][mod.name] = { module: true };
				mod.actions.forEach((action) => {
					perms[role][mod.name][action] = true;
				});
			}
		});
	});
	return perms;
};

const BusRoleAccessManagement = () => {
	const [roles, setRoles] = useState([]); // dynamic roles
	const [permissions, setPermissions] = useState({});
	const [openRole, setOpenRole] = useState(null); // Track which role's modules are open
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [newRole, setNewRole] = useState(""); // New role input
	const [adding, setAdding] = useState(false); // Add role loading
	const [addError, setAddError] = useState("");

	// Add new role handler
	const handleAddRole = (e) => {
		e.preventDefault();
		if (!newRole.trim()) {
			setAddError("Role name cannot be empty");
			return;
		}
		if (roles.includes(newRole.trim())) {
			setAddError("Role already exists");
			return;
		}
		setAdding(true);
		setAddError("");
		fetch('http://localhost:8000/api/roles', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: newRole.trim() }),
		})
			.then(res => res.json())
			.then(data => {
				if (data && data.status === 'success' && data.data && data.data.name) {
					const updatedRoles = [...roles, data.data.name];
					setRoles(updatedRoles);
					setPermissions(perms => ({ ...perms, [data.data.name]: generateInitialPermissions([data.data.name])[data.data.name] }));
					setNewRole("");
				} else {
					setAddError(data?.message || "Failed to add role");
				}
				setAdding(false);
			})
			.catch(() => {
				setAddError("Failed to add role");
				setAdding(false);
			});
	};

	// Fetch roles from backend on mount
	useEffect(() => {
		fetch('http://localhost:8000/api/roles')
			.then(res => res.json())
			.then(data => {
				if (data && data.status === 'success' && Array.isArray(data.data)) {
					const roleNames = data.data.map(r => r.name);
					setRoles(roleNames);
					setPermissions(perms => Object.keys(perms).length ? perms : generateInitialPermissions(roleNames));
				}
			});
	}, []);

	// Fetch permissions from backend on mount
	useEffect(() => {
		setLoading(true);
		fetch('http://localhost:8000/api/role-permissions')
			.then(res => res.json())
			.then(data => {
				if (data && data.status === 'success' && data.data && Object.keys(data.data).length) {
					setPermissions(data.data);
				} else if (roles.length) {
					setPermissions(generateInitialPermissions(roles));
				}
				setLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roles]);

	const handleModuleChange = (role, module) => {
		if (role === 'Superadmin') return; // Superadmin permissions can't be edited
		setPermissions((prev) => {
			const prevRole = prev[role] || {};
			const prevModule = prevRole[module] || { module: false };
			const newModuleState = !prevModule.module;
			// If enabling module, enable all actions; if disabling, keep actions as is
			const updatedActions = {};
			Object.keys(prevModule).forEach((key) => {
				if (key !== 'module') {
					updatedActions[key] = newModuleState ? true : prevModule[key];
				}
			});
			return {
				...prev,
				[role]: {
					...prevRole,
					[module]: {
						...prevModule,
						module: newModuleState,
						...updatedActions,
					},
				},
			};
		});
	};

	const handleActionChange = (role, module, action) => {
		if (role === 'Superadmin') return; // Superadmin permissions can't be edited
		setPermissions((prev) => {
			const prevRole = prev[role] || {};
			const prevModule = prevRole[module] || { module: false };
			return {
				...prev,
				[role]: {
					...prevRole,
					[module]: {
						...prevModule,
						[action]: !prevModule[action],
						// Do NOT change the module property here!
					},
				},
			};
		});
	};

	const handleSave = () => {
		setSaving(true);
		fetch('http://localhost:8000/api/role-permissions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(permissions),
		})
			.then(res => res.json())
			.then(() => {
				setSaving(false);
				alert('Permissions saved successfully!');
			});
	};

	// Helper to render a row for a module or submodule
	const renderModuleRow = (role, mod) => {
		const modPerm = permissions[role]?.[mod.name] || {};
		return (
			<tr key={`${role}-${mod.name}`} className="border-t hover:bg-gray-50">
				<td className="p-3 text-gray-800 font-medium">{mod.name}</td>
				<td className="p-3 text-center">
					<input
						type="checkbox"
						checked={!!modPerm.module}
						onChange={() => handleModuleChange(role, mod.name)}
						disabled={role === 'Superadmin'}
						className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
					/>
				</td>
				{mod.actions.map((action) => (
					<td key={`${role}-${mod.name}-${action}`} className="p-3 text-center">
						<input
							type="checkbox"
							checked={!!modPerm[action]}
							onChange={() => handleActionChange(role, mod.name, action)}
							disabled={!!modPerm.module || role === 'Superadmin'}
							className={`h-5 w-5 text-blue-600 rounded focus:ring-blue-500 ${modPerm.module || role === 'Superadmin' ? 'opacity-50 cursor-not-allowed' : ''}`}
						/>
					</td>
				))}
			</tr>
		);
	};

	if (loading) {
		return <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">Loading permissions...</div>;
	}

	return (
		<div className="min-h-screen w-full p-0 m-0 bg-gray-100 flex flex-col">
			<div className="flex-grow flex flex-col justify-center overflow-auto pb-8">
				<div className="p-6 max-w-6xl w-full mx-auto bg-white rounded-lg shadow-md overflow-x-auto">
					<h2 className="text-2xl font-bold mb-4 text-gray-800">Role Access Management - Bus Booking</h2>
					{/* Add Role Form */}
					<form onSubmit={handleAddRole} className="flex items-center gap-3 mb-6">
						<input
							type="text"
							placeholder="Enter new role name"
							value={newRole}
							onChange={e => setNewRole(e.target.value)}
							className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							disabled={adding}
						/>
						<button
							type="submit"
							disabled={adding}
							className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
						>
							{adding ? 'Adding...' : 'Add Role'}
						</button>
						{addError && <span className="text-red-600 text-sm ml-2">{addError}</span>}
					</form>
					{roles.map((role) => (
						<div key={role} className="mb-8 border rounded-lg">
							<button
								onClick={() => setOpenRole(openRole === role ? null : role)}
								className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-t-lg focus:outline-none"
							>
								<span className="text-xl font-semibold text-gray-700">{role}</span>
								<span className={`transform transition-transform ${openRole === role ? 'rotate-90' : ''}`}>▶</span>
							</button>
							{openRole === role && (
								<div className="overflow-x-auto border-t">
									{role === 'Superadmin' ? (
										<div className="p-6 text-green-700 text-lg font-semibold text-center">Superadmin has all permissions for all modules.</div>
									) : (
										<table className="w-full border-collapse min-w-max">
											<thead>
												<tr className="bg-gray-100">
													<th className="p-3 text-left text-gray-700 font-semibold">Permissions</th>
													<th className="p-3 text-center text-gray-700 font-semibold">All</th>
													{/* Render all unique actions for this role's modules/submodules in the correct order */}
													{(() => {
														// Get all unique actions in the order: view, add, edit, delete, print
														const actionOrder = ['view', 'add', 'edit', 'delete', 'print'];
														const allActions = [];
														modules.forEach((mod) => {
															const actions = mod.submodules
																? mod.submodules.flatMap((sub) => sub.actions)
																: mod.actions;
															actions.forEach((a) => {
																if (!allActions.includes(a)) allActions.push(a);
															});
														});
														// Sort allActions by actionOrder
														const sortedActions = actionOrder.filter((a) => allActions.includes(a));
														return sortedActions.map((action) => (
															<th key={action} className="p-3 text-center text-gray-700 font-semibold capitalize">
																{action}
															</th>
														));
													})()}
												</tr>
											</thead>
											<tbody>
												{modules.map((mod) =>
													mod.submodules
														? mod.submodules.map((sub) => renderModuleRow(role, sub))
														: renderModuleRow(role, mod)
												)}
											</tbody>
										</table>
									)}
								</div>
							)}
						</div>
					))}
					<div className="mt-6 flex justify-end">
						<button
							disabled={saving}
							onClick={handleSave}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
						>
							{saving ? 'Saving...' : 'Save Permissions'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BusRoleAccessManagement;
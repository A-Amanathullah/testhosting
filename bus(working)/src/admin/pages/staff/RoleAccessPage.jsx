import React, { useState, useEffect, useCallback } from 'react';
import { usePermissions } from '../../../context/PermissionsContext';

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
		name: 'Bus Routes',
		actions: ['view', 'add', 'edit', 'delete'],
	},
	{
		name: 'Bus Register',
		actions: ['view', 'add', 'edit', 'delete'],
	},
	{
		name: 'Booking Management',
		submodules: [
			{ name: 'Bus Booking', actions: ['view', 'edit','print'] },
			{ name: 'Freezing Seat', actions: ['view', 'add', 'edit'] },
		],
	},
	{
		name: 'Staff Management',
		submodules: [
			{ name: 'Staff List', actions: ['view', 'add', 'edit', 'delete', 'print'] },
			{ name: 'Role Access Management', actions: ['view','add', 'edit'] },
		],
	},
	{
		name: 'Report',
		submodules: [
			{ name: 'Bus Booking Report', actions: ['view', 'print'] },
			{ name: 'Cancellation Report', actions: ['view', 'print'] },
			{ name: 'Agentwise Report', actions: ['view', 'print'] },
			{ name: 'Revenue Report', actions: ['view', 'print'] },
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
			{ name: 'Loyalty Members', actions: ['view','delete'] },
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

// Helper to set all permissions for Superadmin
const setSuperadminPermissions = (perms) => {
	const superPerms = {};
	modules.forEach((mod) => {
		if (mod.submodules) {
			mod.submodules.forEach((sub) => {
				superPerms[sub.name] = { module: true };
				sub.actions.forEach((action) => {
					superPerms[sub.name][action] = true;
				});
			});
		} else {
			superPerms[mod.name] = { module: true };
			mod.actions.forEach((action) => {
				superPerms[mod.name][action] = true;
			});
		}
	});
	return { ...perms, Superadmin: superPerms };
};

const BusRoleAccessManagement = () => {
	const [roles, setRoles] = useState([]); // dynamic roles
	const [permissions, setPermissions] = useState({});
	const [openRole, setOpenRole] = useState(null); // Track which role's modules are open
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(false); // Track loading errors
	const [saving, setSaving] = useState(false);
	const [newRole, setNewRole] = useState(""); // New role input
	const [adding, setAdding] = useState(false); // Add role loading
	const [addError, setAddError] = useState("");
	const [notification, setNotification] = useState({ message: "", type: "error" });

	// Show notification helper
	const showNotification = useCallback((message, type = "error") => {
		setNotification({ message, type });
	}, []);

	// Hide notification after 3 seconds
	useEffect(() => {
		if (notification.message) {
			const timer = setTimeout(() => {
				setNotification({ message: "", type: "error" });
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [notification]);

	const { permissions: userPerms } = usePermissions();

	// Helper to check permission for Role Access Management
	const hasRoleAccessPermission = (action) => {
		if (!userPerms || !userPerms['Role Access Management']) return false;
		return !!userPerms['Role Access Management'][action];
	};

	// Add new role handler
	const handleAddRole = (e) => {
		e.preventDefault();
		if (!newRole.trim()) {
			setAddError("Role name cannot be empty");
			showNotification("Role name cannot be empty", "error");
			return;
		}
		if (roles.includes(newRole.trim())) {
			setAddError("Role already exists");
			showNotification("Role already exists", "error");
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
					showNotification(`Role "${data.data.name}" added successfully`, "success");
				} else {
					const errorMessage = data?.message || "Failed to add role";
					setAddError(errorMessage);
					showNotification(errorMessage, "error");
				}
				setAdding(false);
			})
			.catch((err) => {
				console.error("Error adding role:", err);
				setAddError("Failed to add role");
				showNotification("Failed to add role. Please try again.", "error");
				setAdding(false);
			});
	};

	// Function to fetch roles that can be called for initial load and retries
	const fetchRoles = useCallback(() => {
		setLoading(true);
		setLoadError(false);
		
		fetch('http://localhost:8000/api/roles')
			.then(res => {
				if (!res.ok) {
					throw new Error(`Failed to fetch roles: ${res.status} ${res.statusText}`);
				}
				return res.json();
			})
			.then(data => {
				if (data && data.status === 'success' && Array.isArray(data.data)) {
					const roleNames = data.data.map(r => r.name);
					setRoles(roleNames);
					setPermissions(perms => setSuperadminPermissions(Object.keys(perms).length ? perms : generateInitialPermissions(roleNames)));
				} else {
					throw new Error('Invalid role data format received');
				}
			})
			.catch(err => {
				console.error('Error fetching roles:', err);
				showNotification('Failed to load roles. Please try again.', 'error');
				setLoadError(true);
				setLoading(false);
			});
	}, [setLoading, setLoadError, setRoles, setPermissions, showNotification]);
	
	// Fetch roles on component mount
	useEffect(() => {
		fetchRoles();
	}, [fetchRoles]);

	// Function to fetch permissions that can be called for initial load and retries
	const fetchPermissions = useCallback(() => {
		setLoading(true);
		setLoadError(false);
		
		fetch('http://localhost:8000/api/role-permissions')
			.then(res => {
				if (!res.ok) {
					throw new Error(`Failed to fetch permissions: ${res.status} ${res.statusText}`);
				}
				return res.json();
			})
			.then(data => {
				if (data && data.status === 'success' && data.data && Object.keys(data.data).length) {
					setPermissions(setSuperadminPermissions(data.data));
				} else if (roles.length) {
					setPermissions(setSuperadminPermissions(generateInitialPermissions(roles)));
				}
				setLoading(false);
			})
			.catch(err => {
				console.error('Error fetching permissions:', err);
				showNotification('Failed to load permissions. Please try again.', 'error');
				setLoading(false);
				setLoadError(true);
			});
	}, [roles, setLoading, setLoadError, setPermissions, showNotification]);
	
	// Fetch permissions from backend when roles change
	useEffect(() => {
		if (roles.length > 0) {
			fetchPermissions();
		}
	}, [roles, fetchPermissions]);

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
		const updatedPermissions = setSuperadminPermissions(permissions);
		fetch('http://localhost:8000/api/role-permissions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedPermissions),
		})
			.then(res => res.json())
			.then(() => {
				setSaving(false);
				setPermissions(setSuperadminPermissions(updatedPermissions));
				showNotification('Permissions saved successfully!', 'success');
			})
			.catch(err => {
				setSaving(false);
				console.error("Error saving permissions:", err);
				showNotification('Failed to save permissions. Please try again.', 'error');
			});
	};

	// Helper to render a row for a module or submodule
	const ACTION_ORDER = ['view', 'add', 'edit', 'delete', 'print'];
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
				{ACTION_ORDER.map((action) =>
					mod.actions.includes(action) ? (
						<td key={`${role}-${mod.name}-${action}`} className="p-3 text-center">
							<input
								type="checkbox"
								checked={!!modPerm[action]}
								onChange={() => handleActionChange(role, mod.name, action)}
								disabled={!!modPerm.module || role === 'Superadmin'}
								className={`h-5 w-5 text-blue-600 rounded focus:ring-blue-500 ${modPerm.module || role === 'Superadmin' ? 'opacity-50 cursor-not-allowed' : ''}`}
							/>
						</td>
					) : (
						<td key={`${role}-${mod.name}-${action}`} className="p-3 text-center"></td>
					)
				)}
			</tr>
		);
	};

	// Handle loading and error states
	if (loading || loadError) {
		return (
			<div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
				{loading ? (
					<>
						<div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
						<div className="flex flex-col items-center">
							<h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Permissions</h3>
							<p className="text-gray-500">Please wait while we fetch role access data...</p>
						</div>
					</>
				) : loadError ? (
					<div className="text-center p-6 bg-white rounded-lg shadow-md">
						<svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<h3 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Data</h3>
						<p className="text-gray-600 mb-4">We encountered a problem while loading the permissions.</p>
						<button
							onClick={fetchPermissions}
							className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
						>
							Try Again
						</button>
					</div>
				) : null}
			</div>
		);
	}

	return (
		<div className="min-h-screen w-full p-0 m-0 bg-gray-100 flex flex-col">
			{notification.message && (
				<div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow flex items-center ${
					notification.type === "success" 
						? "bg-green-100 border border-green-400 text-green-700" 
						: "bg-red-100 border border-red-400 text-red-700"
				}`}>
					<span>{notification.message}</span>
					<button 
						className={`ml-3 font-bold ${notification.type === "success" ? "text-green-700" : "text-red-700"}`} 
						onClick={() => setNotification({ message: "", type: "error" })}
					>
						×
					</button>
				</div>
			)}
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
							disabled={adding || !hasRoleAccessPermission('add')}
						/>
						<button
							type="submit"
							disabled={adding || !hasRoleAccessPermission('add')}
							className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
						>
							{adding ? 'Adding...' : 'Add Role'}
						</button>
						{addError && <span className="text-red-600 text-sm ml-2">{addError}</span>}
						{!hasRoleAccessPermission('add') && (
    <span className="text-red-600 text-sm ml-2">You don't have permission to add roles.</span>
  )}
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
							disabled={saving || !hasRoleAccessPermission('edit')}
							onClick={handleSave}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
						>
							{saving ? 'Saving...' : 'Save Permissions'}
						</button>
						{!hasRoleAccessPermission('edit') && (
    <span className="text-red-600 text-sm ml-2">You don't have permission to save permissions.</span>
  )}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BusRoleAccessManagement;
migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // 1. Add 'role' select field if it doesn't exist
    if (!users.fields.getByName('role')) {
      users.fields.add(
        new SelectField({
          name: 'role',
          required: false,
          values: ['admin', 'corretor'],
          maxSelect: 1,
        }),
      )
    }

    // 2. Adjust API rules on users collection:
    // listRule: users can see themselves, OR if caller is admin (@request.auth.role = 'admin') they can list all
    users.listRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    // viewRule: users can see themselves, OR caller is admin
    users.viewRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    // createRule: public sign up is allowed, OR admin can create
    users.createRule = ''
    // updateRule: admin can update any user, or normal user can update themselves but CANNOT change their own role!
    // Note: PocketBase rule syntax for protecting role:
    // (@request.auth.role = 'admin') || (id = @request.auth.id && @request.body.role:changed = false)
    users.updateRule =
      "@request.auth.role = 'admin' || (id = @request.auth.id && @request.body.role:changed = false)"
    // deleteRule: only admin can delete users, and cannot delete themselves if desired, but here admin can delete any user
    users.deleteRule = "@request.auth.role = 'admin'"

    app.save(users)

    // 3. Ensure pauloac1000@gmail.com has admin role and is active
    try {
      const userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'pauloac1000@gmail.com')
      userRecord.set('role', 'admin')
      userRecord.setVerified(true)
      app.save(userRecord)
    } catch (_) {
      const newAdmin = new Record(users)
      newAdmin.setEmail('pauloac1000@gmail.com')
      newAdmin.setPassword('Skip@Pass')
      newAdmin.setVerified(true)
      newAdmin.set('name', 'Administrador Paulo')
      newAdmin.set('role', 'admin')
      app.save(newAdmin)
    }
  },
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const roleField = users.fields.getByName('role')
    if (roleField) {
      users.fields.remove(roleField)
    }
    users.listRule = 'id = @request.auth.id'
    users.viewRule = 'id = @request.auth.id'
    users.createRule = ''
    users.updateRule = 'id = @request.auth.id'
    users.deleteRule = 'id = @request.auth.id'
    app.save(users)
  },
)

import ts from 'typescript/lib/tsserverlibrary'
import never from 'never'
import { join } from 'path'

const init = ({ typescript }: { typescript: typeof ts }): ts.server.PluginModule => {
  return {
    create: (info: ts.server.PluginCreateInfo): ts.LanguageService => {
      const _resolveModuleNames =
        (info.languageServiceHost.resolveModuleNames ?? never()).bind(info.languageServiceHost)
      info.languageServiceHost.resolveModuleNames = (moduleNames, containingFile, ...rest) => {
        const resolvedModules = _resolveModuleNames(moduleNames, containingFile, ...rest)
        // Fallback resolve dir
        if (resolvedModules.filter(Boolean).length === 0 && moduleNames[0].startsWith('.')) {
          const virtualFile = join(containingFile, '..', moduleNames[0], 'index.d.ts')

          // const virtualFile = join(info.project.getCurrentDirectory(), 'virtual.d.ts')
          const text = 'export const goodNumber = 3'
          // typescript.createLanguageServiceSourceFile(virtualFile, {
          //   getChangeRange: () => undefined,
          //   getLength: () => text.length,
          //   getText: (start, end) => text.slice(start, end)
          // }, ts.ScriptTarget.ES2016, '0', false, ts.ScriptKind.TS)
          info.project.writeFile(virtualFile, text)

          console.log(`Resolved virtual file: ${virtualFile}`)
          return [{
            resolvedFileName: virtualFile,
            extension: ts.Extension.Dts
          }]
        }
        return resolvedModules
      }

      return info.languageService
    }
  }
}

export = init

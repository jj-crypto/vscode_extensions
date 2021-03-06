import * as vscode from 'vscode';
import { RgaCommand } from './rgaCommand';

export class Dx12Command extends RgaCommand
{
    private targetProfile = '';
    private gpsoPath = '';
    private stages = [];

    protected initializeCustomArguments() : Thenable<any>
    {
        return super.pickCustomArguments("Custom arguments - Use '--rs-bin <path>' if your root signature is not already defined in the file.");
    }

    private initializeTargetProfile() : Thenable<any>
    {
        var picks = ['6_0', '6_1', '5_0', '5_1', '6_2', '6_3', '6_4'];
        return super.showQuickPick(picks, "Shader model.", (pick) => {
                this.targetProfile = pick;
        })
    }

    private initializeGpsoPath() : Thenable<any>
    {
        return this.showQuickCustomPicks("gpsoPath", ".gpso path - Leave empty for compute shaders.", (pick) => {
            this.gpsoPath = pick;
            return true;
        });
    }

    private initializeShaderStage(entryPoint : string) : Thenable<any>
    {
        var picks = ['vs', 'ps', 'cs', 'gs', 'hs', 'ds'];
        return super.showQuickPick(picks, "Shader stage for " + entryPoint, pick => {
            this.stages.push("--" + pick + "-entry " + entryPoint);
        });
    }

    protected getOptions()
    {
        var config = vscode.workspace.getConfiguration('rga');
        var userDefineOptions = config.get<string>('arguments.dx12');
        var options = new Array<[string, string]>(
            ['-s', 'dx12'],
            ['-c', this.getTargetAsic()],
            ['--isa', this.getIsaPath()],
            ['--all-hlsl', this.getSourcePath()],
            ['--all-model', this.targetProfile],
            ['', userDefineOptions],
            ['', this.getCustomArguments()],
            ['', this.stages.join(' ')]
        );

        if(this.gpsoPath !== '')
        {
            options.push(['--gpso', '"' + this.gpsoPath + '"']);
        }

        return options;
    }

    protected getInitializingFunctions()
    {
        var methods = [];
        var selections = this.getSelections();
        selections.forEach(selection => {
            if(selection !== '')
            {
                methods.push(() => {return this.initializeShaderStage(selection)});
            }
        });

        methods = methods.concat([
            () => {return this.initializeTargetProfile()},
            () => {return this.initializeGpsoPath()} 
        ]);
        return methods;
    }
}